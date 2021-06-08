
import React, { useState, useEffect } from 'react';
import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   Touchable,
   TouchableOpacity,
   useColorScheme,
   View,
   Alert,
   Dimensions, 
} from 'react-native';

 
 const App = () => {
  
  const [highscore, setHighscore] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [endScore, setEndScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [page, setPage] = useState<string>('home');
  const [values, setValues] = useState<Array<{id: number, value: number, tapped: boolean}>>([])
  const [levelStarted, setLevelStarted] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);

  const navigate = (value: string) => setPage(value);

  const makeLevel = () => {
    if(level > 21){
      setLevelStarted(false);
      setLives(3);
      setLevel(1);
      setScore(0);
      setCurrent(1);
      setEndScore(score);
      navigate('gameWon');
    }
    else{
      let newValues = [];
      for(let i = 1; i < 25; i++){
        newValues.push({id: i, value: -1, tapped: false});
      }
      for(let i = 1; i < level + 4; i++){
        newValues.shift();
        newValues.push({id: i, value: i, tapped: false});
      }
      newValues.sort(() => Math.random() - 0.5);
      setValues(newValues);
      navigate('game');
    }
  }

  const getNext = (id: number) => {
    if(!levelStarted){
      setLevelStarted(true);
    }
    let updatedValues = [...values];
    var value: {id: number, value: number, tapped: boolean} | undefined =  (updatedValues.find(element => element.id == id));
    if(value != undefined){
      value.tapped = true;
    }
    if(value != undefined){
      if(value.value === current){
        if(value.value === level + 3){
          setCurrent(1);
          setLevel(level + 1);
          setLevelStarted(false);
          setScore(score + 1);
          navigate('levelDone')
        }
        else{
          setCurrent(current + 1);
        }
      }
      else{
        if(lives <= 1){
          if(score > highscore){
            setHighscore(score);
          }
          setLevelStarted(false);
          setLives(3);
          setLevel(1);
          setScore(0);
          setCurrent(1);
          setEndScore(score);
          navigate('gameOver')
        }
        else{
          setLevelStarted(false);
          setLives(lives - 1);
          setCurrent(1);
          navigate('fail');
        }
      }
    }
    setValues(updatedValues);
  }

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setLevelStarted(false);
    setCurrent(1);
    navigate('home')
  }

   return (
     <SafeAreaView style={styles.sectionContainer}>
       {page === 'home' ? 
        <View>
          <View style={styles.topView}>
            <Text style={styles.topViewText}>Chimp</Text>
            <Text style={styles.topViewText}>test</Text>
            <TouchableOpacity style={styles.playbutton} onPress={() => makeLevel()}><Text style={styles.playbuttonText}>Play</Text></TouchableOpacity>
            <Text style={styles.highscoreText}>Highscore: {highscore}</Text>
          </View>
        </View>
       : page === 'game' ?
       <View style={styles.sectionContainer}>
        <View style={styles.gameTopView}>
          <View style={styles.gameTopViewLeft}>
            <TouchableOpacity onPress={() => Alert.alert(
              "Quit", 
              "Are you sure, all progress will be lost.",
              [
                { text: "Quit", onPress: () => resetGame() },
                { text: "Cancel", onPress: () => navigate('game') }
              ])}><Text>Quit</Text></TouchableOpacity>
            </View>
          <View style={styles.gameTopViewRight}>
            <Text style={styles.gameTopViewText}>Level: {level}</Text>
            <Text style={styles.gameTopViewText}>Lives: {lives}</Text>
          </View>
        </View>
        <View style={styles.gameContent}>
          {values.map(item => (
            <View  key={item.id}>
              
              {item.value === -1 ? <View style={styles.emptyTile}><Text style={styles.tileText}></Text></View> : <TouchableOpacity onPress={!item.tapped ? () => getNext(item.id) : () => void(0)}>
                <View style={item.tapped ? styles.emptyTile : (levelStarted ? styles.hiddenTile : styles.tile)}><Text style={styles.tileText}>{item.id}</Text></View></TouchableOpacity>}
            </View>
          ))}
        </View>
       </View>
       : page === 'fail' ?
       <View style={styles.topView}>
         <Text style={styles.topViewText}>You</Text>
         <Text style={styles.topViewText}>Failed</Text>
         <TouchableOpacity style={styles.playbutton} onPress={() => makeLevel()}>
            <Text style={styles.playbuttonText}>Try again</Text>
          </TouchableOpacity>
          <Text style={styles.topViewText}>Lives left:</Text>
          <Text style={styles.topViewText}>{lives}</Text>
       </View>
       : page === 'levelDone' ?
       <View style={styles.topView}>
         <Text style={styles.topViewText}>Good</Text>
         <Text style={styles.topViewText}>Job</Text>
         <TouchableOpacity style={styles.playbutton} onPress={() => makeLevel()}><Text style={styles.playbuttonText}>Next level</Text></TouchableOpacity>
       </View>
       : page === 'gameOver' ?
       <View style={styles.topView}>
         <Text style={styles.topViewText}>Game</Text>
         <Text style={styles.topViewText}>Over</Text>
         <Text style={styles.highscoreText}>Score: {endScore}</Text>
         <TouchableOpacity style={styles.playbutton} onPress={() => navigate('home')}><Text style={styles.playbuttonText}>Home</Text></TouchableOpacity>
         <TouchableOpacity style={styles.playbutton} onPress={() => makeLevel()}><Text style={styles.playbuttonText}>Play again</Text></TouchableOpacity>
       </View>
       : page === 'gameWon' ?
       <View style={styles.topView}>
         <Text style={styles.topViewText}>You</Text>
         <Text style={styles.topViewText}>Win!!!</Text>
         <Text style={styles.highscoreText}>Score: {endScore}</Text>
         <TouchableOpacity style={styles.playbutton} onPress={() => navigate('home')}><Text style={styles.playbuttonText}>Home</Text></TouchableOpacity>
         <TouchableOpacity style={styles.playbutton} onPress={() => makeLevel()}><Text style={styles.playbuttonText}>Play again</Text></TouchableOpacity>
       </View>
       :
       <View></View>
        }
     </SafeAreaView>
   );
 };
 const windowWidth = Dimensions.get('window').width;
 const windowHeight = Dimensions.get('window').height;
 const styles = StyleSheet.create({
   sectionContainer: {
    backgroundColor: '#3399FF',
    height: '100%'
   },
   topView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
   },
   topViewText: {
    fontSize: 80,
    fontWeight: '600',
  },
   playbutton: {
    alignItems: "center",
    backgroundColor: '#FF7900',
    padding: 15,
    marginTop: 50,
    width: '100%'
   },
   playbuttonText: {
     fontSize: 40
   },
   highscoreText: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 50
  },
  gameTopView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',
   },
   gameTopViewLeft: {
     display: 'flex',
     flexDirection: 'row',
     justifyContent: 'center',
     width: '20%',
     alignSelf: 'center'
   },
   gameTopViewRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
   },
   gameTopViewText: {
    fontSize: 25,
    fontWeight: '600',
   },
   gameContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
     width: '100%',
     height: '100%',
   },
   tile: {
     width: (windowWidth - 40) / 4,
     height: (windowHeight  - ((windowHeight / 100) * 10) - 80) / 6,
     margin: 5,
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#FFFFFF',
   },
   hiddenTile: {
    width: (windowWidth - 40) / 4,
    height: (windowHeight  - ((windowHeight / 100) * 10) - 80) / 6,
    margin: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
   borderBottomLeftRadius: 20,
   borderBottomRightRadius: 20,
   borderColor: '#FFFFFF',
   backgroundColor: '#FFFFFF',
  },
  emptyTile: {
    width: (windowWidth - 40) / 4,
    height: (windowHeight  - ((windowHeight / 100) * 10) - 80) / 6,
    margin: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
   tileText: {
    fontSize: 25,
    color: '#FFFFFF',
  }
 });

 export default App;
