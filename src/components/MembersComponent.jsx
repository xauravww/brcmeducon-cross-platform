import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Divider, Portal, Modal } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import API_URL from "../connection/url"
import { authContext } from '../context/AuthContextFunction';
const MembersComponent = () => {
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
const { authData} = useContext(authContext)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/admin/members`,{headers:{
                    "Authorization":`Bearer ${authData?.token}`
                }});
                setMembers(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const onChangeSearch = (query) => setSearchQuery(query);

    const filteredMembers = members.filter((member) => {
        const searchableFields = ['name', 'rollno', 'branch', 'semester'];
        return searchableFields.some((field) =>
            member[field].toLowerCase().includes(searchQuery.toLowerCase())
        );
    }).filter(member => filterRole === 'All' || member.role === filterRole).filter(member => {
        if (filterRole === 'student') {
            return (!selectedBranch || member.branch === selectedBranch) && (!selectedSemester || member.semester === selectedSemester);
        }
        return true;
    });

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Cover source={{ uri: item.imageurl.url }} />
            <Card.Content>
                <Title style={styles.title}>{item.name}</Title>
                <Paragraph style={styles.paragraph}>Email: {item.email}</Paragraph>
                <Paragraph style={styles.paragraph}>Phone: {item.phone}</Paragraph>
                <Paragraph style={styles.paragraph}>Role: {item.role}</Paragraph>
                {item.role === 'student' && (
                    <>
                        <Paragraph style={styles.paragraph}>Branch: {item.branch}</Paragraph>
                        <Paragraph style={styles.paragraph}>Semester: {item.semester}</Paragraph>
                    </>
                )}
            </Card.Content>
            <Card.Actions>
                <Button
                    mode="contained"
                    onPress={() => handleEdit(item)}
                    style={styles.editButton}
                    labelStyle={styles.editButtonText}
                >
                    Edit
                </Button>
            </Card.Actions>
        </Card>
    );

    const handleEdit = (member) => {
        setModalVisible(true);
        console.log('Editing member:', member);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#ffffff',
        },
        card: {
            marginBottom: 20,
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            elevation: 3,
        },
        searchBar: {
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor:"white",
            borderWidth:1,
            borderColor:"#e0e0e0",
            elevation: 3,
            color: '#0D47A1',
            tintColor:"black",
            
            
        },
        searchBarInput: {
            fontSize: 16,
        },
        divider: {
            marginBottom: 20,
        },
        dropdownColumn: {
            marginBottom: 20,
        },
        premiumDropdown: {
            flex: 1,
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            backgroundColor: '#f9f9f9',
            elevation: 3,
        },
        premiumDropdownList: {
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            backgroundColor: '#ffffff',
            elevation: 3,
        },
        flatList: {
            flex: 1,
        },
        title: {
            fontSize: 20,
            
            color: '#123',
            marginBottom: 15,
            fontFamily:'Montserrat-Bold'
        },
        paragraph: {
            fontSize: 16,
            color: '#555',
            marginBottom: 10,
            fontFamily:"NotoSans_Condensed-Regular"
        },
        editButton: {
            marginTop: 20,
            borderRadius: 10,
            elevation: 3,
            backgroundColor: '#1a73e8',
        },
        editButtonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        modalContainer: {
            backgroundColor: '#ffffff',
            padding: 20,
            borderRadius: 10,
            elevation: 5,
        },
    });

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                    placeholderTextColor="black"
                    cursorColor="black"
                    iconColor='black'
                    rippleColor="transparent"
                    clearButtonMode="always"
                    inputStyle={{color:"black"}}
                    
                />
                <Divider style={styles.divider} />

                <View style={styles.dropdownColumn}>
                    <SelectDropdown
                        data={['All', 'student', 'faculty', 'admin']}
                        defaultValue="All"
                        onSelect={(selectedItem, index) => {
                            setFilterRole(selectedItem);
                            setSelectedBranch('');
                            setSelectedSemester('');
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        style={styles.premiumDropdown}
                        dropdownStyle={styles.premiumDropdownList}
                        buttonStyle={{
                         backgroundColor:"white",
                            width: "100%",
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.23,
                            shadowRadius: 2.62,
                            elevation: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 12,
                            borderWidth: 1
                        }}
                        buttonTextStyle={{
                            color: "black",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}

                    />
                    {filterRole === 'student' && (
                        <>
                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 10 }}>
                                <SelectDropdown
                                    data={[...new Set(members.map((member) => member.branch)), 'Branch']}
                                    defaultButtonText="Branch"
                                    onSelect={(selectedItem, index) => {
                                        setSelectedBranch(selectedItem === 'branch' ? '' : selectedItem);
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem === 'branch' ? 'Branch' : selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item === 'branch' ? 'branch' : item;
                                    }}
                                    style={styles.premiumDropdown}
                                    dropdownStyle={styles.premiumDropdownList}
                                    buttonStyle={{
                                        backgroundColor: "white",
                                        width: "40%",
                                        borderRadius: 10,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.23,
                                        shadowRadius: 2.62,
                                        elevation: 4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 12,
                                        borderWidth: 1
                                    }}
                                    buttonTextStyle={{
                                        color: "black",
                                        fontSize: 16,
                                        fontWeight: "bold",
                                    }}

                                />

                                <SelectDropdown
                                    data={[...new Set(members.map((member) => member.semester)), 'Select Semester']}
                                    defaultButtonText="Semester"
                                    onSelect={(selectedItem, index) => {
                                        setSelectedSemester(selectedItem === 'Semester' ? '' : selectedItem);
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem === 'Semester' ? 'Semester' : selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item === 'Semester' ? 'Semester' : item;
                                    }}
                                    style={styles.premiumDropdown}
                                    dropdownStyle={styles.premiumDropdownList}
                                    buttonStyle={{
                                        backgroundColor: "white",
                                        width: "40%",
                                        borderRadius: 10,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.23,
                                        shadowRadius: 2.62,
                                        elevation: 4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 12,
                                        borderWidth:1
                                    }}
                                    buttonTextStyle={{
                                        color: "black",
                                        fontSize: 16,
                                        fontWeight: "bold",
                                    }}

                                />
                            </View>
                        </>
                    )}
                </View>
                <FlatList
                    data={filteredMembers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    style={styles.flatList}
                />

                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <Title>Edit Member</Title>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    );
};

export default MembersComponent;
