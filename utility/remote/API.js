import AsyncStorage from '@react-native-async-storage/async-storage';

export function GetHabits(callBack) {
  try {
    AsyncStorage.getItem('habits')
      .then(result => {
        let habits = new Array();
        if (result) {
          habits = JSON.parse(result);
        }
        callBack({
          isSuccess: true,
          habits: habits,
        });
      })
      .catch(err => {
        callBack({
          isSuccess: false,
          habits: [],
        });
      });
  } catch (error) {
    callBack({
      isSuccess: false,
      habits: [],
    });
  }
}

export function AddUpdateHabit(
  title,
  desc,
  callBack,
  id = null,
  isComplete = false,
) {
  try {
    AsyncStorage.getItem('habits')
      .then(result => {
        let habits = new Array();
        if (result) {
          habits = JSON.parse(result);
          if (id === null) {
            habits.push({
              id: Date.now(),
              title: title,
              description: desc,
              creationTime: Date.now(),
              updationTime: Date.now(),
              isComplete: isComplete,
            });
          } else {
            for (let i = 0; i <= habits.length; i++) {
              if (habits[i]?.id === id) {
                let habit = habits[i];
                habits.splice(i, 1);
                habit['title'] = title;
                habit['description'] = desc;
                habit['updationTime'] = Date.now();
                habit['isComplete'] = isComplete;
                habits.push(habit);
              }
            }
          }
        } else {
          habits = new Array();
          habits.push({
            id: Date.now(),
            title: title,
            description: desc,
            creationTime: Date.now(),
            updationTime: Date.now(),
            isComplete: isComplete,
          });
        }
        AsyncStorage.setItem('habits', JSON.stringify(habits))
          .then(() => {
            callBack({
              isSuccess: true,
              habits: habits,
            });
          })
          .catch(() => {
            callBack({
              isSuccess: false,
              habits: [],
            });
          });
      })
      .catch(err => {
        callBack({
          isSuccess: false,
          habits: [],
        });
      });
  } catch (error) {
    callBack({
      isSuccess: false,
      habits: [],
    });
  }
}

export function DeleteHabit(id, callBack) {
  try {
    AsyncStorage.getItem('habits')
      .then(result => {
        let habits = new Array();
        if (result) {
          habits = JSON.parse(result);
          if (habits.length) {
            const filteredHabits = habits.filter(obj => obj.id !== id);
            AsyncStorage.setItem('habits', JSON.stringify(filteredHabits))
              .then(() => {
                callBack({
                  isSuccess: true,
                  habits: filteredHabits,
                });
              })
              .catch(() => {
                callBack({
                  isSuccess: false,
                  habits: [],
                });
              });
          } else {
            callBack({
              isSuccess: false,
              habits: [],
            });
          }
        }
      })
      .catch(err => {
        callBack({
          isSuccess: false,
          habits: [],
        });
      });
  } catch (error) {
    callBack({
      isSuccess: false,
      habits: [],
    });
  }
}
