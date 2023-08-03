import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface Post {
  id: number;
  title: string;
}

const DummyPostScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response?.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handlePostPress = (postId: number) => {
    // Navigate to PostDetailScreen and pass the selected postId as a parameter
    navigation.navigate('PostDetail', {postId});
  };

  const renderPostItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item?.id)}>
      <Text style={styles.postTitle}>{item?.title}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    // Implement the logout functionality here
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          // After logout, navigate back to the LoginScreen
          navigation.navigate('Login');
        },
      },
    ]);
  };

  // Intercept the hardware back button press and show an alert for logout confirmation
  useEffect(() => {
    const onHardwareBackPress = () => {
      handleLogout(); // Show the logout confirmation alert
      return true; // Prevent default back button behavior
    };

    BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dummy Posts</Text>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => String(item?.id)}
        style={styles.postList}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E6',
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  postList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  postItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DummyPostScreen;
