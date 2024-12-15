import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  Image,
  SectionList,
  Keyboard,
  ScrollView,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PageTheme, WINDOW_HEIGHT, WINDOW_WIDTH} from '../utility/Constant';
import Header from '../componant/Header';
import {
  timeIn12HourFormat,
  toDateAndMonthFromEpoch,
  toMonthAndYearFromEpoch,
} from '../utility/TimeUtilityl';
import ProgressBar from '../componant/ProgressBar';
import {AddUpdateHabit, DeleteHabit, GetHabits} from '../utility/remote/API';
import {Checkbox} from 'react-native-paper';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPostView, setIsPostView] = useState(false);
  const [postRequest, setPostRequest] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [homeWorkData, setHomeWorkData] = useState(new Array());
  const [monthWiseMap, setMonthWiseMap] = useState(new Map());
  const [editModal, setEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    if (homeWorkData.length === 0) {
      setIsLoading(true);
      getPost();
    }
  }, [homeWorkData]);

  const getPost = () => {
    setIsLoading(true);
    GetHabits(postDetailCallBack);
  };

  useEffect(() => {
    if (editPost) {
      setInputTitle(editPost?.title);
      setInputMessage(editPost?.description);
    }
  }, [editPost]);

  const closePostView = () => {
    setIsPostView(false);
    setInputMessage('');
    setInputTitle('');
  };

  const onAddUpdateDelete = () => {
    setIsLoading(true);
    setIsCompleted(false);
    setInputMessage('');
    setInputTitle('');
    setIsPostView(false);
    setMonthWiseMap(new Map());
    setHomeWorkData(new Array());
    setEditPost(null);
  };

  const onCloseEditModal = () => {
    setEditPost(null);
    setEditModal(false);
    setIsPostView(false);
    setIsCompleted(false);
    setInputTitle('');
    setInputMessage('');
  };

  const createPost = () => {
    if (inputMessage.trim() === '' || inputTitle.trim() === '') {
      Alert.alert('Blank field !', 'Please fill all the mandatory field');
      return;
    }
    if (inputTitle.trim().length < 5) {
      Alert.alert(
        'Habit title !',
        'Enter atleast 5 characters in habit title field',
      );
      return;
    }
    if (inputMessage.trim().length < 10) {
      Alert.alert(
        'Habit Description !',
        'Enter atleast 10 characters in message box',
      );
      return;
    }
    setPostRequest(true);
    setIsLoading(true);
    AddUpdateHabit(
      inputTitle,
      inputMessage,
      addHabitCallBack,
      editPost?.id ?? false,
      isCompleted,
    );
  };

  function addHabitCallBack(response) {
    if (response.isSuccess) {
      onAddUpdateDelete();
    } else {
      Alert.alert('Oh snap!', 'Unable to post at the moment');
    }
    setIsLoading(false);
    setPostRequest(false);
  }

  const deleteHabit = () => {
    Alert.alert(
      'Delete?',
      'This habit will be permanently deleted. Are you sure?',
      [
        {
          text: 'ok',
          onPress: () => DeleteHabit(editPost.id, deleteHabitCB),
        },
        {
          text: 'cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const deleteHabitCB = response => {
    if (response.isSuccess) {
      onCloseEditModal();
      onAddUpdateDelete();
    }
  };

  const postDetailCallBack = response => {
    console.log(JSON.stringify(response));
    if (response.isSuccess && response?.habits?.length) {
      monthWiseNotice(response.habits);
    } else {
      setIsLoading(false);
    }
  };

  function monthWiseNotice(noticeBoardData) {
    let tempMonthWiseMap = monthWiseMap;
    for (let noticeData of noticeBoardData) {
      let postMonth = toMonthAndYearFromEpoch(noticeData.creationTime);
      let postArray = [];
      if (tempMonthWiseMap.get(postMonth)) {
        postArray = tempMonthWiseMap.get(postMonth);
        postArray.push(noticeData);
        tempMonthWiseMap.set(postMonth, postArray);
      } else {
        postArray.push(noticeData);
        tempMonthWiseMap.set(postMonth, postArray);
      }
    }
    setMonthWiseMap(tempMonthWiseMap);
    homeWorkSet();
  }

  const homeWorkSet = () => {
    let postPojo = homeWorkData.map(homeworkObj => homeworkObj);
    for (let [key, value] of monthWiseMap) {
      postPojo.push({
        title: key,
        data: value,
      });
    }
    setHomeWorkData(postPojo);
    setIsLoading(false);
  };

  const renderPost = ({item}) => {
    return (
      <Pressable
        onLongPress={() => {
          setEditPost(item);
          setEditModal(true);
        }}
        style={({pressed}) => [
          styles.cardContainer,
          {opacity: pressed ? 0.5 : 1},
        ]}>
        <View>
          <View
            style={{height: 25, alignItems: 'center', flexDirection: 'row'}}>
            <Text style={styles.noticeTitle}>{item?.title ?? 'Title'}</Text>
          </View>
          <View>
            <Text style={styles.noticeDesc}>{item?.description ?? 'text'}</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTopWidth: 0.2,
              borderTopColor: PageTheme.midTheme,
            }}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={styles.tabbutton}>
                {item?.isComplete ? 'completed' : 'pending'}
              </Text>
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              <Text style={styles.tabbutton}>
                {toDateAndMonthFromEpoch(item?.creationTime)}
                {' | ' + timeIn12HourFormat(item?.creationTime)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Header title={'My Habits'} />
      {isPostView ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <Pressable
            onPressOut={() => Keyboard.dismiss()}
            style={styles.modalView}>
            <View style={styles.homeWorkBack}>
              {editPost === null ? (
                <View style={styles.closeBtnBack}>
                  <AntDesign
                    name="closecircleo"
                    style={styles.deleteText}
                    onPress={closePostView}
                  />
                </View>
              ) : (
                <View style={styles.closeBtnBack}>
                  <AntDesign
                    name="closecircleo"
                    style={styles.deleteText}
                    onPress={onCloseEditModal}
                  />
                </View>
              )}
              <View style={styles.inputBoxArea}>
                <View style={styles.titleView}>
                  <TextInput
                    style={styles.inputBox}
                    maxLength={160}
                    placeholderTextColor={'gray'}
                    placeholder="Habit Title"
                    onChangeText={text => setInputTitle(text)}
                    value={inputTitle}
                  />
                </View>
                <View style={[styles.inputBoxArea, styles.messageView]}>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Habit Description"
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      setInputMessage(text);
                    }}
                    value={inputMessage}
                    multiline={true}
                    maxLength={4000}
                  />
                </View>
                {editPost !== null ? (
                  <View style={styles.optionalImage}>
                    <Checkbox.Item
                      status={isCompleted ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setIsCompleted(!isCompleted);
                      }}
                      label={'Task Completed'}
                      color={PageTheme.highContrastTheme}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </Pressable>
        </ScrollView>
      ) : isLoading ? (
        <ProgressBar message="Loading please wait..." />
      ) : homeWorkData.length ? (
        <View style={[styles.modalView, {flex: 1}]}>
          <View
            style={[
              styles.homeWorkBack,
              {
                flex: 1,
                width: '100%',
                backgroundColor: '#F6F6F6',
              },
            ]}>
            {isLoading ? (
              <ProgressBar message="Loading please wait..." />
            ) : (
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={homeWorkData}
                keyExtractor={(item, index) => item.creationTime}
                renderItem={renderPost}
                renderSectionHeader={({section: {title}}) => (
                  <View style={styles.styleDate}>
                    <Text style={styles.textItem}>{title}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <View style={styles.modalView}>
            <Text
              numberOfLines={1}
              style={[styles.textItalice, {marginTop: 10}]}>
              There is no any Habit added.
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.textItalice, {marginTop: 10}]}>
              Press add Habit.
            </Text>
          </View>
        </ScrollView>
      )}

      <View style={styles.sendBtnBack}>
        {!isPostView ? (
          <Pressable
            style={({pressed}) => [styles.sendBtn, pressed && {opacity: 0.5}]}
            onPress={() => {
              setIsPostView(true);
            }}>
            <Text style={[styles.closeBtnTxt, {color: '#fff'}]}>
              Add Habbit
            </Text>
          </Pressable>
        ) : postRequest ? (
          <View style={styles.sendBtn}>
            <Text style={[styles.closeBtnTxt, {color: '#fff'}]}>
              {editPost === null ? 'Sending...' : 'Updating...'}
            </Text>
          </View>
        ) : (
          <Pressable
            style={({pressed}) => [
              styles.sendBtn,
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
            onPress={() => {
              createPost();
            }}>
            <Text style={[styles.closeBtnTxt, {color: '#fff'}]}>
              {editPost === null ? 'SEND' : 'UPDATE'}
            </Text>
          </Pressable>
        )}
      </View>

      <Modal
        visible={editModal}
        transparent={true}
        onRequestClose={onCloseEditModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0008',
          }}>
          <View style={styles.editModal}>
            <Pressable
              style={({pressed}) => [
                styles.closeModalBtn,
                pressed && {opacity: 0.5},
              ]}
              onPress={onCloseEditModal}>
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={25}
                color={'indigo'}
              />
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.editDeleteBtn,
                pressed && {opacity: 0.5},
              ]}
              onPress={() => {
                setEditModal(false);
                setIsPostView(true);
              }}>
              <MaterialIcons name="edit" size={35} color={'green'} />
              <Text style={[styles.editDeleteText, {color: 'green'}]}>
                EDIT
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.editDeleteBtn,
                pressed && {opacity: 0.5},
              ]}
              onPress={deleteHabit}>
              <MaterialIcons name="delete" size={35} color={'tomato'} />
              <Text style={[styles.editDeleteText, {color: 'tomato'}]}>
                DELETE
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: PageTheme.lightTheme,
  },
  modalView: {
    width: WINDOW_WIDTH,
    alignItems: 'center',
  },
  homeWorkBack: {
    paddingVertical: 10,
    width: WINDOW_WIDTH * 0.92,
  },
  closeBtnBack: {
    width: WINDOW_WIDTH * 0.92,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  titleView: {
    width: WINDOW_WIDTH * 0.85,
    borderBottomWidth: 1,
    borderColor: PageTheme.lowContrastTheme,
    alignSelf: 'center',
  },
  messageView: {
    width: WINDOW_WIDTH * 0.85,
    minHeight: WINDOW_HEIGHT * 0.25,
    maxHeight: WINDOW_HEIGHT * 0.35,
    borderWidth: 0,
  },
  optionalImage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: PageTheme.lowContrastTheme,
  },
  closeBtnTxt: {
    fontFamily: 'Inter-Medium',
    color: '#000',
    fontSize: 16,
  },
  inputBoxArea: {
    width: WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    padding: 5,
    borderWidth: 0.5,
    borderColor: PageTheme.darkTheme,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#FFFF',
  },
  inputBox: {
    color: '#000',
    fontFamily: 'Inter',
  },
  attachmentsView: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 5,
  },
  attachImage: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginVertical: 5,
    marginRight: 5,
    borderColor: PageTheme.black,
    borderRadius: 3,
  },
  tabbutton: {
    textAlign: 'center',
    color: 'gray',
    fontFamily: 'Inter',
    fontSize: 10,
  },
  label: {
    fontFamily: 'Inter',
    color: '#818181',
    fontSize: 12,
  },
  deleteImage: {
    position: 'absolute',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    top: 0,
    right: 0,
    backgroundColor: '#fff8',
    zIndex: 1,
  },
  deleteText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  sendBtnBack: {
    width: WINDOW_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PageTheme.lightTheme,
    paddingVertical: 12,
  },
  sendBtn: {
    width: WINDOW_WIDTH * 0.6,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: PageTheme.midContrastTheme,
    borderRadius: 5,
  },
  selectPhotoModal: {
    position: 'absolute',
    bottom: 0,
    width: WINDOW_WIDTH,
    paddingVertical: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 0.2,
    borderLeftWidth: 0.2,
    borderRightWidth: 0.2,
    backgroundColor: '#fff',
  },
  cameraBtn: {
    // width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: 'gray',
  },
  defaultBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F4E4FF',
  },
  textItalice: {
    fontFamily: 'Inter',
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    fontStyle: 'italic',
  },
  cardContainer: {
    position: 'relative',
    width: '90%',
    height: 125,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  noticeTitle: {
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  styleDate: {
    width: WINDOW_WIDTH * 0.92,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textItem: {
    color: '#848484',
    textAlign: 'left',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  noticeDesc: {
    fontFamily: 'OpenSans-Medium',
    fontSize: 12,
    textAlign: 'left',
    color: '#000000',
  },
  postBy: {
    fontFamily: 'Inter',
    fontSize: 12,
    textAlign: 'justify',
    textTransform: 'capitalize',
    color: '#000000',
  },
  iconcontainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editDeleteText: {
    color: 'indigo',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  editDeleteBtn: {
    width: WINDOW_WIDTH * 0.2,
    height: WINDOW_HEIGHT * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 5,
  },
  editModal: {
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_HEIGHT * 0.2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  closeModalBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
