import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DummyPostScreen: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handlePostPress = (postId: number) => {
    // Navigate to PostDetailScreen and pass the selected postId as a parameter
    navigation.navigate('PostDetail', { postId });
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dummy Posts</Text>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => String(item.id)}
        style={styles.postList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
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
});

export default DummyPostScreen;
