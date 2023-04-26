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

// import React, { useEffect, useState } from 'react';
// import keycloak from './keycloak';
// import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// const GET_TASKS = gql`
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
// `;

// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql',
//   cache: new InMemoryCache(),
//   headers: {
//     Authorization: `Bearer ${keycloak.token}`,
//   },
// });

// function App() {
//   const { loading, error, data } = useQuery(GET_TASKS);
//       useEffect(() => {
//     keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
//     if(authenticated){
//       console.log('authenticated')
//     }
//     else{
//       keycloak.login()
      
//     }
//     });
//   }, []);
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return (
//     <div>
//       <h1>Welcome to my app</h1>
//       <div>
//         {data.allTasks.edges.map((edge) => (
//           <div key={edge.node.id}>
//             <p>Name: {edge.node.name}</p>
//             <p>Department: {edge.node.section.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function ApolloWrapper({ children }) {
//   return (
//     <ApolloProvider client={client}>
//       {children}
//     </ApolloProvider>
//   );
// }

// function AppWrapper() {
//   return (
//     <ApolloWrapper>
//       <App />
//     </ApolloWrapper>
//   );
// }

// export default AppWrapper;

// import React, { useEffect, useState } from 'react';
// import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import keycloak from './keycloak';

// const client = new ApolloClient({
//   uri: 'https://localhost:5000/graphql',
//   cache: new InMemoryCache(),
// });

// const ALL_TASKS_QUERY = gql`
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
// `;

// function App() {
//   const [authenticated, setAuthenticated] = useState(false);
//   const { loading, error, data } = useQuery(ALL_TASKS_QUERY);

//   useEffect(() => {
//     keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
//       if(authenticated) {
//         setAuthenticated(true);
//       } else {
//         keycloak.login();
//       }
//     });
//   }, []);

//   if (error) return <p>Error: {error.message}</p>;
//   if (!authenticated) return <p>Authenticating...</p>;
//   if (loading) return <p>Loading...</p>;
//   if (!data.allTasks) return <p>No tasks found.</p>;

//   return (
//     <div>
//       <h1>Welcome to my app</h1>

//       <ul>
//         {data.allTasks.edges.map(({ node }) => (
//           <li key={node.id}>
//             {node.name} - {node.section.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function Root() {
//   return (
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   );
// }

// export default Root;





// import React, { useEffect, useState } from "react";
// import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
// import keycloak from "./keycloak";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const { initialized } = useKeycloak();

//   async function fetchTasks(token) {
//     const response = await fetch("http://localhost:5000/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         query: `
//           {
//             allTasks {
//               edges {
//                 node {
//                   id
//                   name
//                   section {
//                     name
//                   }
//                 }
//               }
//             }
//           }
//         `,
//       }),
//     });

//     const { data } = await response.json();
//     return data.allTasks.edges.map((edge) => edge.node);
//   }

//   useEffect(() => {
//     if (initialized) {
//       keycloak
//         .getToken()
//         .then((token) => fetchTasks(token))
//         .then((tasks) => {
//           setTasks(tasks);
//         });
//     }
//   }, [initialized]);

//   return (
//     <div>
//       <h1>Task List</h1>
//       {tasks.map((tasks) => (
//         <div key={tasks.id}>
//           <p>Name: {tasks.name}</p>
//           <p>Department: {tasks.section.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// function KeycloakWrapper({ children }) {
//   return (
//     <ReactKeycloakProvider
//       authClient={keycloak}
//       initOptions={{ onLoad: "check-sso" }}
//     >
//       {children}
//     </ReactKeycloakProvider>
//   );
// }

// function AppWrapper() {
//   return (
//     <KeycloakWrapper>
//       <App />
//     </KeycloakWrapper>
//   );
// }

// export default AppWrapper;
