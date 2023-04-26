// import React, { useEffect, useState } from 'react';
// import keycloak from './keycloak';
// import { gql } from '@apollo/client';
// function App() {
//   const GET_TASKS=gql`
//   {
//     allTasks {
//       edges {
//         node {
//           id
//           name
//           section {
//             name
//           }
//         }
//       }
//     }
//   }
//   `
//   const [tasks, setTasks] = useState([]);
//   useEffect(() => {
//     keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
//     if(authenticated){
//       console.log('authenticated')
//     }
//     else{
//       keycloak.login()
      
//     }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Welcome to my app</h1>
     
     
     
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import keycloak from './keycloak';
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import Todos from './components/Todos';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
 const rootElement = document.getElementById("root");
   
const GET_TASKS = gql`
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
`;

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${keycloak.token}`,
  },
});

function App() {
  const { loading, error, data } = useQuery(GET_TASKS);
  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
      if (authenticated) {
        console.log('authenticated')
      } else {
        keycloak.login()
      }
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Welcome to my app</h1>
      <div>
        {data.allTasks.edges.map((edge) => (
          <div key={edge.node.id}>
            <p>Name: {edge.node.name}</p>
            <p>Department: {edge.node.section.name}</p>
          </div>
        ))}
      </div>
 
    </div>
  );
}

function ApolloWrapper({ children }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

function AppWrapper() {
  return (
    <ApolloWrapper>
      <App />
    </ApolloWrapper>
  );
}

export default AppWrapper;

