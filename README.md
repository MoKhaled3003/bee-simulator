# Bee Simulator

simulator for testing purpose 
## Installation

Use the node package manager to install dependencies.

```bash
npm install 
npm start
```

## Usage

```python
change config file in config folder in the root path with your db connection under test.

to change between api versions in app.js root file change index router to controller appropriate version V0 or V1
V0 ruby billing system
V1 New billing system

'post' HTTP request with XML payload to 'http://localhost:3000/api/v1/bee/payment'
to test new billing system

'post' HTTP request with XML payload to 'http://localhost:3000/api/v0/bee/payment'
to test ruby billing system