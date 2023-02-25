import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens'
import {decode, encode} from 'base-64'
import { auth , db} from './src/firebase/config';
import {doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  if (loading) {	
    return (	
      <>Loading</>	
    )	
  }

  useEffect(()=>{
    onAuthStateChanged(auth, async (authData)=>{
      if(authData){
        const uid = authData.uid;
        console.log(authData)
        const userRef = doc(db, "users", uid);
        await getDoc(userRef)
        .then(snapShot => {
            const userData = snapShot.data();
            setUser(userData);

        })
      }
    })
  },[])


  return (
    <NavigationContainer>
      <Stack.Navigator>
        { user ? (
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
          
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}