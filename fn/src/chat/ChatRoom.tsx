import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api/axiosConfig';

const {width} = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isRecommendation?: boolean;
  isSelected?: boolean;
}

interface FoodInfo {
  cuisine: string;
  ingredients: string[];
  description: string;
  vegan: boolean;
  allergies: string[];
}

const GRADIENT_COLORS = [['#616161', '#515151']];

export default function ChatRoom(): React.ReactElement {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFoodInfo, setSelectedFoodInfo] = useState<FoodInfo | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFoodName, setSelectedFoodName] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const inputWidthAnim = useRef(new Animated.Value(width - 80)).current;

  useEffect(() => {
    if (inputText.trim() !== '') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(inputWidthAnim, {
          toValue: width - 130,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(inputWidthAnim, {
          toValue: width - 80,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [inputText, fadeAnim, scaleAnim, inputWidthAnim]);

  const handleFoodSelection = async (selectedFood: string) => {
    try {
      setSelectedFoodName(selectedFood);
      const infoResponse = await api.get('/food/food_info', {
        params: {food: selectedFood},
      });

      if (infoResponse && infoResponse.data) {
        setSelectedFoodInfo(infoResponse.data);
        setShowFoodModal(true);
      }
    } catch (error) {
      console.error('음식 정보 가져오기 실패:', error);
      alert('음식 정보를 가져오는데 실패했습니다.');
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedFoodName) return;

    try {
      const response = await api.post('/food/select_food', {
        food: selectedFoodName,
      });

      if (response && response.status === 201) {
        setShowFoodModal(false);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: String(prevMessages.length + 1),
            text: `${selectedFoodName}를 선택하셨습니다!`,
            sender: 'ai',
          },
        ]);
      }
    } catch (error) {
      console.error('음식 선택 실패:', error);
      alert('음식 선택에 실패했습니다.');
    }
  };

  const handleSend = async () => {
    if (inputText.trim() !== '') {
      setLoading(true);
      try {
        const response = await api.post('/food/food_text', {
          text: inputText,
        });

        if (response && response.data) {
          if (response.data.foods && Array.isArray(response.data.foods)) {
            console.log(response.data.foods);
            setMessages([
              {
                id: '1',
                text: response.data.foods.join(','),
                sender: 'ai',
                isRecommendation: true,
              },
            ]);
          }
        }
      } catch (error: any) {
        console.error('API 요청 실패:', JSON.stringify(error, null, 2));

        setMessages([
          {
            id: '1',
            text: '죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다.',
            sender: 'ai',
          },
        ]);
      } finally {
        setLoading(false);
        setInputText('');
      }
    }
  };

  const renderFoodCard = (food: string, index: number) => (
    <TouchableOpacity key={index} onPress={() => handleFoodSelection(food)} style={styles.foodCard}>
      <LinearGradient
        colors={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientCard}
      >
        <View style={styles.foodContent}>
          <Icon
            name='food-variant'
            size={28}
            color='rgba(255,255,255,0.9)'
            style={styles.foodIcon}
          />
          <Text style={styles.foodName}>{food}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const FoodInfoModal = () => (
    <Modal visible={showFoodModal} transparent animationType='slide'>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedFoodInfo?.cuisine}</Text>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>설명</Text>
            <Text style={styles.description} numberOfLines={isExpanded ? undefined : 3}>
              {selectedFoodInfo?.description}
            </Text>
            {selectedFoodInfo?.description &&
              selectedFoodInfo.description.split('\n').length > 3 && (
                <TouchableOpacity onPress={toggleExpanded}>
                  <Text style={styles.moreButton}>{isExpanded ? '접기' : '더보기'}</Text>
                </TouchableOpacity>
              )}
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.ingredientsList}>
              {selectedFoodInfo?.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredient}>
                  • {ingredient}
                </Text>
              ))}
            </View>

            <View style={styles.infoTags}>
              {selectedFoodInfo?.vegan && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>비건</Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirmSelection}
            >
              <Text style={styles.buttonText}>선택하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowFoodModal(false)}
            >
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={24} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Planner</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name='magnify' size={24} color='#666' style={styles.searchIcon} />
          <Animated.View style={{width: inputWidthAnim}}>
            <TextInput
              style={styles.searchInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder='What food are you looking for?'
              placeholderTextColor='#666'
              onSubmitEditing={handleSend}
            />
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
              position: 'absolute',
              right: 10,
            }}
          >
            <TouchableOpacity onPress={handleSend} style={styles.searchButton}>
              <LinearGradient colors={['#874da2', '#c43a30']} style={styles.gradientButton}>
                <Icon name='send' size={20} color='#fff' />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#fff' />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {messages.length > 0 && messages[0].isRecommendation && (
            <View style={styles.recommendationsContainer}>
              {messages[0].text.split(',').map((food, index) => renderFoodCard(food.trim(), index))}
            </View>
          )}
        </ScrollView>
      )}
      <FoodInfoModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 15,
    padding: 10,
    position: 'relative',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  searchButton: {
    marginLeft: 10,
  },
  gradientButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  recommendationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  foodCard: {
    width: '96%',
    height: 140,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientCard: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  foodContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodIcon: {
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  selectText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalScroll: {
    maxHeight: '70%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  moreButton: {
    color: '#007AFF',
    marginTop: 5,
  },
  ingredientsList: {
    marginTop: 5,
    marginBottom: 10,
  },
  ingredient: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  infoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#4a90e2',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
