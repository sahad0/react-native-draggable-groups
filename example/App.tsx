/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Alert,
  Button,
  SafeAreaView,
  View,
  Text,
  Image,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableGroupList from './components/DraggableGroupList';
import { addSectionToList, deleteSectionFromList } from './utils/utils';
import { COLOR, MARGIN } from './constants';
import type {
  FieldData,
  FlatListGroupItem,
  SectionDataItem,
} from './types/types';

// global.JSL = (args: any): any =>
//   console.log(JSON.stringify(args, getCircularReplacer(), 2));

const dummyArr = [
  {
    id: 'colIdA',
    title: 'Naruto',
    text: 'Naruto Uzumaki (うずまき ナルト, Uzumaki Naruto)',
  },
  {
    id: 'colIdB',
    title: 'Sasuke',
    text: 'Sasuke Uchiha (うちは サスケ, Uchiha Sasuke)',
  },
  {
    id: 'colIdC',
    title: 'Sakura',
    text: 'Sakura Haruno (春野 サクラ, Haruno Sakura)',
  },
  {
    id: 'colIdD',
    title: 'Boruto',
    text: 'Boruto Uzumaki (うずまき ボルト, Uzumaki Boruto)',
  },
  {
    id: 'colIdE',
    title: 'Sarada',
    text: 'Sarada Uchiha (うちは サラダ, Uchiha Sarada)',
  },
  {
    id: 'colIdF',
    title: 'Mitsuki',
    text: 'Mitsuki (ミツキ, Mitsuki)',
  },
  {
    id: 'colIdG',
    title: 'Kakashi',
    text: 'Kakashi Hatake (はたけ カカシ, Hatake Kakashi)',
  },
  {
    id: 'colIdH',
    title: 'Itachi',
    text: 'Itachi Uchiha (うちは イタチ, Uchiha Itachi)',
  },
  {
    id: 'colIdI',
    title: 'Gaara',
    text: 'Gaara (我愛羅, Gaara)',
  },
  {
    id: 'colIdJ',
    title: 'Hinata',
    text: 'Hinata Hyuga (日向 ヒナタ, Hyūga Hinata)',
  },
  {
    id: 'colIdK',
    title: 'Shikamaru',
    text: 'Shikamaru Nara (奈良 シカマル, Nara Shikamaru)',
  },
  {
    id: 'colIdL',
    title: 'Jiraiya',
    text: 'Jiraiya (自来也, Jiraiya)',
  },
  {
    id: 'colIdM',
    title: 'Tsunade',
    text: 'Tsunade (綱手, Tsunade)',
  },
];

function App() {
  const [sectionFieldList, setSectionFieldList] =
    React.useState<(SectionDataItem | FieldData)[]>(dummyArr);

  const createSectionHandler = () => {
    Alert.prompt('Section Name', 'Enter section name', (name) => {
      if (!name) return; // Handle case where no name is entered

      const sectionId = `${Math.floor(Math.random() * 1_000_000)}section`;
      setSectionFieldList(
        (prevSectionFieldList): (SectionDataItem | FieldData)[] =>
          addSectionToList({
            list: prevSectionFieldList,
            sectionName: name,
            s_id: sectionId,
          })
      );
    });
  };

  const deleteSectionHandler = (s_id: string) => {
    setSectionFieldList((prevSectionFieldList: any): any =>
      deleteSectionFromList({
        list: prevSectionFieldList,
        s_id,
        appendAtTop: true,
      })
    );
  };

  const seperatorItem = () => {
    return <View style={[styles.groupSeperator]} />;
  };

  const renderItem = ({ item, index, isActive }: FlatListGroupItem) => {
    const columnDetails = Object.assign(
      {},
      item && item?.sectionName
        ? {
            val: item?.sectionName || '',
            text: 'Drop fields here to add inside section',
          }
        : { text: item?.text || 'No Description' }
    );
    return (
      <View
        style={[
          styles.cardStyle,
          isActive ? { backgroundColor: COLOR.GRAY100 } : {},
        ]}
        key={item?.id ?? `index_${index}`}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item?.sectionId ? (
            <Image
              style={{
                height: MARGIN.EXTRA_LARGE + 5,
                width: MARGIN.EXTRA_LARGE + 5,
                marginLeft: MARGIN.MARGIN_8,
              }}
              source={require('./assets/new.jpg')}
            />
          ) : null}
          <Text
            style={[
              styles.titleStyle,
              {
                color: item?.sectionName
                  ? COLOR.BLACK_BANNER_TEXT
                  : COLOR.WHITE,
              },
            ]}
          >
            {item?.title || item?.sectionName || ''}
          </Text>
        </View>

        <Text style={styles.subTitleStyle}>{columnDetails.text}</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView>
        <Button onPress={createSectionHandler} title="Create Section" />
        <DraggableGroupList
          sectionFieldList={sectionFieldList}
          setSectionFieldList={setSectionFieldList}
          seperatorComponent={seperatorItem}
          renderItemComponent={renderItem}
          onSectionPress={(sectionId: string) => {
            deleteSectionHandler(sectionId);
          }}
          onItemPress={() => console.log('first')}
          renderItemStyle={styles.addtionalStylesParent}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Export both the createSectionHandler function and App component
export default App;

const styles = StyleSheet.create({
  groupSeperator: {
    height: 10,
    borderWidth: 0.5,
    borderColor: COLOR.BORDER_DASHBOARD,
    backgroundColor: COLOR.GRAY100,
  },
  subTitleStyle: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'Inter-Medium',
    marginHorizontal: MARGIN.MEDIUM,
    color: COLOR.GRAY900,
  },
  titleStyle: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Inter-Medium',
    marginHorizontal: MARGIN.MEDIUM,
    color: COLOR.WHITE,
  },
  addtionalStylesParent: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.16,
    elevation: 20,
  },
  cardStyle: {
    borderColor: COLOR.BORDER,
    borderWidth: 0.5,
    paddingVertical: MARGIN.MEDIUM,
    backgroundColor: COLOR.WHITE,
  },
});
