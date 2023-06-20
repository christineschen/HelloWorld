exports = async function (logs) {
  if (!logs || logs.length == 0) {
    throw new Error("logs are empty")
  }
  console.log('num of logs: %d', logs.length);
  const pd = require('@pagerduty/pdjs');
  const _ = require('lodash');

  const pdRoutingKey = context.values.get("pdRoutingKey");

  // batches of 20 to keep under number of available sockets on VM
  const logBatches = _.chunk(logs, 20);

  for (const logBatch of logBatches) {
    const promiseList = [];

    logBatch.forEach(log => {
      const action = log.has_error ? 'trigger' : 'resolve';
      const name = log.event_subscription_name || log.function_name;

      promiseList.push(
        pd.event({
          data: {
            routing_key: pdRoutingKey,
            server: 'https://10gen.pagerduty.com/',
            event_action: action,
            dedup_key: log.appId + log.type + name,
            payload: {
              summary: `Canary Failure: ${log.appId} in ${log.location} - ${log.type}: ${name}`,
              source: 'canary-app',
              severity: 'error',
              custom_details: {
                error: log.error,
                co_id: log.co_id,
              }
            },
            links: [{
              "href": `https://realm.mongodb.com/groups/${log.groupId}/apps/${log.appId}/logs?co_id=${log.co_id}`,
              "text": "View App Logs"
            }]
          },
        }).then(console.log)
        .catch(console.error)
      );
    }); 

    await Promise.all(promiseList);
  }
};
