# Canary Apps

This README is for creating and updating the prod and staging canary apps. More details can be found [here](https://wiki.corp.mongodb.com/display/MMS/Baas+Ops#BaasOps-CanaryApps).

## Create the apps

1. Navigate to the proper 10gen Stitch Canary project for creating an app in staging or production
2. Create a new app. Ensure that the provider region is correct
3. Enable hosting
4. Add the required secrets. Find the secrets by looking at an existing canary app. Currently the existing secret names are http_bb and http_dep_resolution. The value is in the linked wiki
5. Enable API Key Auth and deploy the change
6. Create an API Key, copy the generated key as this is needed in the next step
7. Create a [CLOUDP](https://jira.mongodb.org/browse/CLOUDP-125180) ticket for SRE to add the API Key to the prober env vars. Use the following format:\
&emsp;`CANARY_<PROD/STAGING>_<GLOBAL/LOCAL>_<CLOUD_PROVIDER>_<REGION>_API_KEY`
8. Add the config for the new app to `etc/configs/<ENV>_baas_canary_prober_config.json`
9. Once the config changes are merged to master, the `update-canary-apps task` will attempt to update and deploy the changes to the app. Watch this task for a success to ensure that the triggers, endpoints, etc. are created for the app\
Note: If an error occurs during deploying dependencies, ensure that the S3 bucket for the canary app location exists. If the location is a new location, SRE will have to create the bucket. See [CLOUDP-122936](https://jira.mongodb.org/browse/CLOUDP-122936) for reference.
10. Navigate to the app in the UI and ensure that the app is set up correctly
11. Add the app to the linked wiki above.\
Note: we don't need to add webhooks and endpoints links for deployment migration application.

## Update the apps

To modify the external dependencies, you will only need to change the package.json. The update-canary-apps evergreen task will take care of installing the dependencies, creating the node_modules archive, and uploading it.

## Enabling / Disabling Feature Flags

To enable or disable a feature flag for Canary apps

1. Get the domain for the Canary apps
2. Get your Bearer Auth Token for this domain
3. Get the Group ID or App IDs for these apps
4. Call one of the following Feature Flag endpoints

After calling these endpoints, the feature flag will be `immutable`, which means it will not be affected by normal percentage distribution. See the [Feature Flag README](../../app/featureflag/README.md) for more information.

### Distribute by Group ID

**Request:**

```shell
POST <domain>/api/private/v1.0/groups/<group_id>/features/<feature_flag_name>
```

**Request Body:**

```shell
{
  "action": <enable-or-disable>
}
```

#### Group ID Example in Dev

**Request:**

```shell
curl -X POST https://realm-dev.mongodb.com/api/private/v1.0/groups/606ca9cff94a4c6e9dc00040/features/ip_access_list \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <Token>" \
     -d '{"action": "enable"}'
```

**Response:**

```json
{
  "modified": 2,
  "matched": 2
}
```

### Distribute by App IDs

**Request:**

```shell
POST <domain>/api/private/v1.0/features/<feature_flag_name>
```

**Request Body:**

```shell
{
  "app_ids": [<appID>, <appID>, ...],
  "action": <enable-or-disable>
}
```

#### Request Example in Dev

**Request:**

```shell
curl -X POST https://realm-dev.mongodb.com/api/private/v1.0/features/ip_access_list \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <Token>" \
     -d '{"app_ids": ["62e42b49f0f1eb9dfca50221"], "action": "enable"}'
```

**Response:**

```json
{
  "matched": 1,
  "expected_modified": 1,
  "actual_modified": 1
}
```
