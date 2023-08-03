import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface Post {
  title: string;
  body: string;
}

interface PostDetailScreenProps {
  route: {
    params: {
      postId: number;
    };
  };
}

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({route}) => {
  const {postId} = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(response => response?.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post details:', error));
  }, [postId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
          testID="loading-indicator"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F3E6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#333',
  },
  goBackButton: {
    backgroundColor: '#FF5722',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PostDetailScreen;
