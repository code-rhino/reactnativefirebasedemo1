import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { auth , db} from '../../firebase/config'
import styles from './styles';

export default function HomeScreen({navigation}) {
    const [userName, setUserName] = useState("");

    useEffect(()=>{
        const currentUser = auth.currentUser;   
        if(currentUser){
            const uid = currentUser.uid;
            const docRef = doc(db, "users", uid);
            getDoc(docRef).then(snapShot => {
                console.log("Doc Data", snapShot.data())
                const userData = snapShot.data();
                setUserName(userData.firstName + " " + userData.lastName);
            })
        }
    },[]);

    const onLogoutPress = async() => {
        await signOut(auth)
        .then(()=>{
            console.log("Logged out");
            navigation.navigate('Home')
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
            <Text style={styles.header}>Home Screen</Text>
            <Text>Welcome {userName}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={()=> onLogoutPress()}>
                    <Text style={styles.buttonTitle}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}