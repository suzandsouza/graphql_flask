
A todo application rendering all tasks through graphql on the reactjs page


# Todo Application 

The project supports the following features,

Framework used: React
Backend: Flask, GraphQL
Authentication: Keycloak 




## API Reference

#### Get all tasks

```
  {
    allTasks {
      edges {
        node {
          id
          name
          section {
            name
          }
        }
      }
    }
  }
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `none` | `none` | **Required**.none |



#### Add new tasks

```
  mutation {
  createEmployee(name: "John Doe", departmentId: "RGVwYXJbWVudDoy") {
    employee {
      id
      name
      department {
        id
        name
      }
    }
  }
}
```

| Body       | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|  `name ` `depatmentId`     | `string` | **Required**. Id of department |

####  Delete a task

```
  mutation {
  deleteEmployee(employeeId: "RW1wbG95ZWU6OQ==") {
    success
  }
}
```

| Body       | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|   `success`      | `string` | **Required**. Id of task to delete |


#### Signup

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   `password`    | `string` | **Required**. All parameters |

#### Login

Using Keycloak realm
| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|`email`   `password`        | `string` | **Required**. All parameters |




## Installation

Install my-project with 

```bash

  cd keycloak_auth
  npm i
```
Add the frontend files 

Backend
```bash
  python ./app.py
```


#### The project APIs were tested on GraphQLi 


    
