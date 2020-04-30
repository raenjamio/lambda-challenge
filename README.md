AWS Lambda function to fetch data from a DynamoDB and a relational DB

URL: */Prod/Challenge?TableName=Customer

Create table in DynamoDB and RDS DB

Create a Zip:
1- $ zip function.zip index.js
2- $ aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip

Add environment variables:
dbdatabase
dbhost
dbpassword
dbuser