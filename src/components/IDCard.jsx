import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Title, Subheading, Card, Avatar, Badge } from 'react-native-paper';
import { authContext } from '../context/AuthContextFunction';
import FlipCard from 'react-native-flip-card';

const IDCard = () => {
  const { authData } = useContext(authContext);

  if (!authData) {
    return <Text>Loading...</Text>;
  }

  const userData = authData?.member;
  const { width } = Dimensions.get('window');
  const rolefromApi = userData?.role
  return (
    <View style={styles.cardContainer}>
      <Title style={styles.title}>BRCMCET, Bahal, Haryana</Title>
      <Text style={styles.cardTitle}>ID Card</Text>
      <FlipCard style={{ width: width * 0.9 }} flipHorizontal={true} flipVertical={false}>
        {/* Front side */}
        <Card style={styles.card}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Avatar.Image
                source={{ uri: userData?.imageurl?.url }}
                size={150}
                style={styles.image}
              />
              <View style={styles.headerText}>
                <Title style={styles.name}>{userData?.name}</Title>
                <Subheading style={styles.role}>{userData?.role}</Subheading>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.details}>Email: {userData?.email}</Text>
              <Text style={styles.details}>Phone: {userData?.phone}</Text>
              {rolefromApi == 'student' && <Text style={styles.details}>Roll No: {userData?.rollno}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Batch Year: {userData?.batchYear}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Branch: {userData?.branch}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Semester: {userData?.semester}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Registration No: {userData?.registrationNo}</Text>}




            </View>

            {userData?.verified && (
              <Badge style={styles.badge}>Verified</Badge>
            )}

            <View style={styles.watermark}>
              <Text style={styles.watermarkText}>Affiliated to MDU, Rohtak</Text>
            </View>
          </View>
        </Card>

        {/* Back side */}
        <Card style={styles.card}>
          <View style={styles.content}>
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>Email: {userData?.email}</Text>
              <Text style={styles.details}>Phone: {userData?.phone}</Text>

              {rolefromApi == 'student' && <Text style={styles.details}>Roll No: {userData?.rollno}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Batch Year: {userData?.batchYear}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Branch: {userData?.branch}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Semester: {userData?.semester}</Text>}
              {rolefromApi == 'student' && <Text style={styles.details}>Registration No: {userData?.registrationNo}</Text>}
              <Text style={styles.details}>Address: {userData?.address}</Text>
              <Text style={styles.details}>Father's Name: {userData?.fathername}</Text>
              <Text style={styles.details}>Date of Birth: {new Date(userData?.dateOfBirth).toLocaleDateString()}</Text>
              <Text style={styles.details}>Age: {userData?.age}</Text>
              <Text style={styles.details}>Verified: {userData?.verified ? 'Yes' : 'No'}</Text>
              <Text style={styles.details}>Created At: {new Date(userData?.createdAt).toLocaleDateString()}</Text>
            </View>
            {/* You can add more fields as per your requirement */}
          </View>
        </Card>
      </FlipCard>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  card: {
    borderRadius: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#424242',
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#424242',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  role: {
    fontSize: 20,
    marginBottom: 5,
    color: '#BBDEFB',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#009688',
    alignSelf: 'center',
    marginBottom: 20,
  },
  watermark: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.5,
  },
  watermarkText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
});

export default IDCard;
