# react-native-draggable-groups

A drag-and-drop-enabled FlatList grouping component for React Native

https://github.com/user-attachments/assets/904fe4c6-f3e0-48d8-9d59-d8fdc68f522c

## Acknowledgment

A special thanks to the creators and maintainers of [react-native-draggable-flatlist](https://www.npmjs.com/package/react-native-draggable-flatlist) for providing an excellent library that enables seamless drag-and-drop functionality in React Native applications.

To ensure everything works smoothly, please make sure to install all the dependencies mentioned in the package documentation. Follow the instructions provided in the [react-native-draggable-flatlist](https://www.npmjs.com/package/react-native-draggable-flatlist) page to avoid any compatibility issues.

We are grateful for the effort and dedication of the maintainers who made this fantastic library available!

## Installation

```sh
npm install react-native-draggable-groups
```

```sh
yarn add react-native-draggable-groups
```

## Usage

```js
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Alert,
  Button,
  SafeAreaView,
  View,
  TouchableOpacity,
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
  SeperatorItemType,
} from './types/types';

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

  const seperatorItem = ({ isSectionDragged }: SeperatorItemType) => {
    return (
      <View
        style={[styles.groupSeperator, { opacity: isSectionDragged ? 0 : 1 }]}
      />
    );
  };

  const renderItem = ({
    item,
    onDragPress,
    isSectionDragged,
    index,
    isActive,
  }: FlatListGroupItem) => {
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
      <TouchableOpacity
        onLongPress={onDragPress}
        onPress={() =>
          item?.sectionId ? deleteSectionHandler(item?.sectionId) : {}
        }
        style={[
          {
            opacity: isSectionDragged ? 0 : 1,
            marginHorizontal: item?.groupedTo ? MARGIN.MEDIUM : 0,
          },
          styles.addtionalStylesParent,
        ]}
      >
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
      </TouchableOpacity>
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

```

# Generate Initial List

# getInitialFieldList Function

## Overview

The `getInitialFieldList` function is used to generate an initial list of fields based on the provided `headerData` and `sections`. It processes the header data by either returning it as-is or organizing it into an ordered list with separators and groupings based on the section definitions. If no sections are provided, the function returns the `headerData` directly.

## Parameters

- **`headerData`** (`Array<Object>`):  
  An array of objects where each object represents a field. Each object must have a unique `id` (which can be alphanumeric) and a `name`.  
  **Example**:

  ```javascript
  [
    { id: 'field-1', name: 'Field 1' },
    { id: 'field-2', name: 'Field 2' },
    { id: 'field-3', name: 'Field 3' },
  ];
  ```

- **`sections`** (`Array<Object>`):  
  An optional array of section objects that define how the fields should be grouped. Each section has a unique `sectionId` and an array of `colIds` which are the `id` values of the fields to include in that section..  
  **Example**:

  ```javascript
  [
    { sectionId: 'section-1', colIds: ['field-2'], sectionName: 'Section1' },
    { sectionId: 'section-2', colIds: ['field-3'], sectionName: 'Section2' },
  ];
  ```

- **`headerDataAsObj`** (`Object`):  
  An object where each key is the `id` of a field from `headerData`, and the corresponding value is the field's data object. This structure allows for quick lookups by `id`
  **Example**:
  ```javascript
  {
    "field-1": { id: "field-1", name: "Field 1" },
    "field-2": { id: "field-2", name: "Field 2" },
    "field-3": { id: "field-3", name: "Field 3" }
  }
  ```

# Utility Functions Documentation

This document provides a detailed explanation of each utility function in the codebase. These utilities are designed to manage sections and fields, enabling grouping, editing, and deletion in a drag-and-drop-enabled React Native application.

## Utility Functions

| **Function**                                                     | **Description**                                                                                      | **Parameters**                                                                                                                                                   | **Returns**                                                                                   |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `getSeperatorObj(sectionId)`                                     | Creates a separator object tied to a specific section.                                               | - `sectionId`: The ID of the section to associate with the separator.                                                                                            | An object representing a separator, e.g., `{ isSeperator: true, seperatorGroup: sectionId }`. |
| `getOrderedSectionListWithSeperators(headerDataAsObj, sections)` | Generates an ordered list of sections with separators and grouped items.                             | - `headerDataAsObj`: An object containing header data.<br>- `sections`: An array of section objects.                                                             | An ordered list with sections, grouped items, and separators.                                 |
| `getInitialFieldList({headerData, sections, headerDataAsObj})`   | Creates the initial list of fields, including separators and grouped items if sections are provided. | - `headerData`: The base list of header data.<br>- `sections`: An array of section objects.<br>- `headerDataAsObj`: An object mapping column IDs to header data. | The initial list of fields, optionally including separators and grouped items.                |
| `getSectionObj(sectionId, name, colIds)`                         | Generates a section object.                                                                          | - `sectionId`: The ID of the section.<br>- `name`: The name of the section.<br>- `colIds`: An array of column IDs belonging to the section.                      | A section object, e.g., `{ sectionId, sectionName: name, colIds }`.                           |
| `addSectionToList({ list, sectionName, s_id })`                  | Adds a new section and its separator to the top of the list.                                         | - `list`: The existing list of items.<br>- `sectionName`: The name of the section to add.<br>- `s_id`: The ID of the new section.                                | An updated list with the new section and separator at the top.                                |
| `deleteSectionFromList({ list, s_id, appendAtTop })`             | Deletes a section and its related items, optionally appending them back at the top of the list.      | - `list`: The existing list of items.<br>- `s_id`: The ID of the section to delete.<br>- `appendAtTop`: If `true`, appends removed items to the top of the list. | The updated list after deletion and optional reordering.                                      |
| `editSectionName({ list, itemIndex, sectionName })`              | Edits the name of a section at a specific index in the list.                                         | - `list`: The existing list of items.<br>- `itemIndex`: The index of the section to update.<br>- `sectionName`: The new name for the section.                    | An updated list with the renamed section.                                                     |
| `getAvailableSections({ list })`                                 | Filters the list to return only section items.                                                       | - `list`: The existing list of items.                                                                                                                            | An array of section objects.                                                                  |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
