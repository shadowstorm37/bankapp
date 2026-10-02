# Deployment (AWS, us-east-1)

The app runs in three places:

    Browser
      |
      |  http  (static files)
      v
    S3 bucket, static website hosting ........ the built React app (frontend/dist)
      |
      |  https (JSON, with the login token)
      v
    Lambda Function URL -> Lambda (Python 3.12) the FastAPI app, through Mangum
      |
      |  TLS
      v
    MongoDB Atlas ............................ database "bankapp_prod"

## URLs

| What | Address |
|---|---|
| Website | http://james-barnett-bankapp-frontend-979616.s3-website-us-east-1.amazonaws.com |
| API | https://b4wvwxgjzgqtehkjudi5vntt4y0quwsd.lambda-url.us-east-1.on.aws |
| API health check | https://b4wvwxgjzgqtehkjudi5vntt4y0quwsd.lambda-url.us-east-1.on.aws/api/health |
| Swagger | https://b4wvwxgjzgqtehkjudi5vntt4y0quwsd.lambda-url.us-east-1.on.aws/docs |

## AWS resources

| Resource | Name | Notes |
|---|---|---|
| Lambda function | `james-barnett-bankapp-api` | runtime `python3.12`, handler `app.main.handler`, 512 MB, 30 s timeout |
| Execution role | `quicklabs-fullstack-aws-28sep-batch-a-lambda-exec` | already existed in the class account; not created by this project |
| Function URL | auth type `NONE` | no CORS settings on the URL: FastAPI answers CORS itself |
| S3 bucket | `james-barnett-bankapp-frontend-979616` | website hosting, index and error document both `index.html`, public read-only |
| Log group | `/aws/lambda/james-barnett-bankapp-api` | created automatically by Lambda |

## How it fits together

- **`app/main.py`** ends with `handler = Mangum(app)`. Mangum turns a Function URL event
  into a request for the FastAPI app. Running locally with uvicorn doesn't use it.
- **Settings** are Lambda environment variables, applied from `lambda-env.json`. That file
  holds secrets and is git-ignored. It needs all nine: `MONGODB_URI`, `MONGO_DB_NAME`,
  `CORS_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
  `ADMIN_NAME`, `ADMIN_EMAIL`.
- **`CORS_ORIGINS`** is the website address above, with no trailing slash. If the bucket
  ever changes, this has to change too.
- **The front end** gets the API address at build time from `frontend/.env.production`
  (`VITE_API_URL=<API address, no trailing slash>`, git-ignored).
- **The database** is `bankapp_prod`, separate from the local `bankapp`. The admin account
  is created on the first start, with the password from `ADMIN_PASSWORD`. Changing that
  setting later does not change an admin that already exists.
- **Atlas network access** allows `0.0.0.0/0`, because Lambda has no fixed IP address.
  The database user's password is the only protection, so it must be a strong one.

## Things that behave differently from local

- **Cold starts.** After a quiet period the first request takes about 4 seconds while
  Lambda starts Python and connects to Atlas. Later requests take well under a second.
- **Logging in takes about 1 second**, because bcrypt is slower on Lambda.
- **Refreshing on a page like `/customers` works**, but S3 answers with status 404 and the
  app's `index.html` (the error document). The app loads normally.
- **The website is HTTP, not HTTPS.** S3 website hosting doesn't offer HTTPS. The API is
  HTTPS, so passwords and tokens sent to the API are encrypted.

## Redeploy

API change:

    scripts/build_lambda.sh
    aws lambda update-function-code --function-name james-barnett-bankapp-api \
        --zip-file fileb://lambda.zip

Front-end change:

    cd frontend
    npm run build
    cd ..
    aws s3 sync frontend/dist s3://james-barnett-bankapp-frontend-979616 --delete

Settings change (edit `lambda-env.json` first; this replaces ALL the variables, so the
file must contain every one of them):

    aws lambda update-function-configuration --function-name james-barnett-bankapp-api \
        --environment file://lambda-env.json \
        --query '{Name:FunctionName,Status:LastUpdateStatus}'

The `--query` keeps the command from printing the secrets back to the terminal.

## Check and debug

    curl https://b4wvwxgjzgqtehkjudi5vntt4y0quwsd.lambda-url.us-east-1.on.aws/api/health
    aws logs tail /aws/lambda/james-barnett-bankapp-api --since 10m

| Symptom | Likely cause |
|---|---|
| Website says it can't reach the server | `CORS_ORIGINS` doesn't match the website address, or `VITE_API_URL` was wrong at build time |
| API times out after 30 seconds | Atlas is refusing the connection: check Network Access |
| `Runtime.ImportModuleError` in the logs | a package is missing from `requirements.txt`, or the handler path is wrong |
| Website returns 403 | the bucket policy or the public access setting was changed |

## Teardown

These delete things. Run them only when the project is finished.

    aws lambda delete-function-url-config --function-name james-barnett-bankapp-api
    aws lambda delete-function --function-name james-barnett-bankapp-api
    aws s3 rm s3://james-barnett-bankapp-frontend-979616 --recursive
    aws s3api delete-bucket --bucket james-barnett-bankapp-frontend-979616
    aws logs delete-log-group --log-group-name /aws/lambda/james-barnett-bankapp-api

Then by hand:

- Atlas -> Network Access: remove the `0.0.0.0/0` entry.
- Atlas: drop the `bankapp_prod` database if it is no longer needed.
- AWS console -> Security credentials: delete the CLI access key.

No IAM role was created, so there is none to delete. The execution role belongs to the
class account and must stay.
