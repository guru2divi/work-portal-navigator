
# WorkSpace Hub - AWS Deployment Guide

## Overview
This guide provides detailed instructions for deploying the WorkSpace Hub application to AWS using various services and configurations.

## Architecture Options

### Option 1: Static Site Hosting (Recommended for Frontend-Only)
- **AWS S3** + **CloudFront** for static hosting
- **Route 53** for custom domain
- **AWS Certificate Manager** for SSL

### Option 2: Full Stack with Backend
- **AWS Amplify** for frontend deployment
- **AWS RDS** (PostgreSQL) for database
- **AWS Lambda** for serverless backend functions
- **API Gateway** for REST API endpoints
- **AWS Cognito** for user authentication

### Option 3: Container-Based Deployment
- **AWS ECS** or **EKS** for container orchestration
- **AWS RDS** for database
- **Application Load Balancer** for traffic distribution

## Prerequisites

### Required Tools
- AWS CLI installed and configured
- Node.js 18+ and npm
- Git

### AWS Account Setup
1. Create an AWS account
2. Set up AWS CLI with proper credentials
3. Create an IAM user with appropriate permissions

## Option 1: Static Site Deployment (S3 + CloudFront)

### Step 1: Build the Application
```bash
# Clone your repository
git clone <your-repo-url>
cd workspace-hub

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 2: Create S3 Bucket
```bash
# Create S3 bucket (replace with your domain name)
aws s3 mb s3://your-workspace-hub-domain.com

# Enable static website hosting
aws s3 website s3://your-workspace-hub-domain.com \
  --index-document index.html \
  --error-document index.html
```

### Step 3: Upload Files
```bash
# Upload build files to S3
aws s3 sync dist/ s3://your-workspace-hub-domain.com --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket your-workspace-hub-domain.com --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-workspace-hub-domain.com/*"
    }
  ]
}'
```

### Step 4: CloudFront Distribution
1. Go to AWS CloudFront console
2. Create new distribution
3. Set origin domain to your S3 bucket endpoint
4. Configure custom error pages (404 → /index.html)
5. Add custom domain if needed
6. Deploy distribution

### Step 5: Custom Domain (Optional)
1. Register domain in Route 53
2. Create SSL certificate in Certificate Manager
3. Add CNAME record pointing to CloudFront distribution

## Option 2: Full Stack with Amplify

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify Project
```bash
amplify init
# Follow prompts to configure your project
```

### Step 3: Add Authentication
```bash
amplify add auth
# Choose:
# - Default configuration
# - Username
# - No advanced settings
```

### Step 4: Add API and Database
```bash
amplify add api
# Choose:
# - GraphQL
# - Single object with fields
# - Yes to guided schema creation
```

### Step 5: Add Storage
```bash
amplify add storage
# Choose:
# - Content (Images, audio, video, etc.)
# - Provide bucket name
# - Auth users only access
```

### Step 6: Deploy Backend
```bash
amplify push
```

### Step 7: Deploy Frontend
```bash
amplify add hosting
# Choose:
# - Amazon CloudFront and S3
amplify publish
```

## Environment Variables

### For Static Deployment
Create `.env.production` file:
```
VITE_API_URL=https://your-api-gateway-url.amazonaws.com
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=your-cognito-user-pool-id
VITE_USER_POOL_WEB_CLIENT_ID=your-cognito-client-id
```

### For Amplify Deployment
Amplify handles environment variables automatically through `aws-exports.js`

## Database Setup (RDS PostgreSQL)

### Step 1: Create RDS Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier workspace-hub-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default
```

### Step 2: Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer',
    workspaces TEXT[], -- Array of workspace IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspaces table
CREATE TABLE workspaces (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    light_color VARCHAR(50),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User workspace permissions
CREATE TABLE user_workspace_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    workspace_id VARCHAR(50) REFERENCES workspaces(id),
    permission VARCHAR(20) DEFAULT 'view', -- view, edit, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, workspace_id)
);

-- Files table
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id VARCHAR(50) REFERENCES workspaces(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    s3_key VARCHAR(500),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Lambda Functions for Backend

### Authentication Handler
```javascript
// lambda/auth.js
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    const { action, username, email, password } = JSON.parse(event.body);
    
    if (action === 'register') {
        // User registration logic
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save to RDS
    }
    
    if (action === 'login') {
        // User login logic
        // Verify credentials and return JWT
    }
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ success: true })
    };
};
```

## Security Best Practices

### 1. IAM Roles and Policies
- Create least-privilege IAM roles
- Use separate roles for different services
- Enable MFA for admin access

### 2. VPC Configuration
- Deploy RDS in private subnets
- Use security groups to restrict access
- Enable VPC Flow Logs

### 3. SSL/TLS
- Use AWS Certificate Manager for SSL certificates
- Enforce HTTPS redirects in CloudFront
- Enable HSTS headers

### 4. Monitoring and Logging
- Enable CloudTrail for API logging
- Set up CloudWatch alarms
- Use AWS Config for compliance monitoring

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to S3
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        aws s3 sync dist/ s3://your-bucket-name --delete
        aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Cost Optimization

### 1. S3 Storage Classes
- Use S3 Intelligent-Tiering for automatic cost optimization
- Set up lifecycle policies for old files

### 2. CloudFront Caching
- Configure appropriate cache behaviors
- Use CloudFront regional edge caches

### 3. RDS Optimization
- Use Reserved Instances for production
- Enable automated backups with appropriate retention
- Consider Aurora Serverless for variable workloads

## Monitoring and Maintenance

### 1. Health Checks
- Set up Route 53 health checks
- Configure CloudWatch alarms for key metrics

### 2. Backup Strategy
- Enable automated RDS backups
- Create S3 versioning for static assets
- Test restore procedures regularly

### 3. Updates and Patches
- Keep Lambda runtimes updated
- Monitor security advisories
- Plan regular maintenance windows

## Troubleshooting

### Common Issues
1. **CORS Errors**: Configure API Gateway CORS settings
2. **Authentication Issues**: Check Cognito user pool configuration
3. **Database Connection**: Verify security group rules
4. **File Upload Issues**: Check S3 bucket policies and IAM permissions

### Useful Commands
```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name your-stack-name

# View Lambda function logs
aws logs tail /aws/lambda/your-function-name --follow

# Test API Gateway endpoint
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/stage/endpoint
```

## Support and Resources

### AWS Documentation
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS Amplify User Guide](https://docs.amplify.aws/)
- [Amazon RDS User Guide](https://docs.aws.amazon.com/rds/)

### Contact Information
- Project Repository: [Your GitHub Repo URL]
- Documentation: [Your Docs URL]
- Support Email: [Your Support Email]

---

**Note**: This guide provides a comprehensive overview of deploying WorkSpace Hub to AWS. Choose the deployment option that best fits your requirements and scale. For production deployments, consider engaging with AWS Professional Services or a certified AWS partner for additional support.
