/* eslint-disable react-native/no-inline-styles */
import { Alert, LayoutAnimation, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { nextFrame } from '../utils/utils';
import { COLOR, MARGIN } from '../constants';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import type {
  DraggableGroupListProps,
  DragItemOption,
  GroupSectionData,
  SectionDataItem,
} from '../types/types';

const emptyFn = () => {};

const DraggableGroupList: React.FC<DraggableGroupListProps> = ({
  sectionFieldList,
  setSectionFieldList,
  seperatorComponent,
  renderItemComponent,
  renderItemStyle = {},
  onSectionPress = emptyFn,
  onItemPress = emptyFn,
}: any) => {
  const [dragOptions, setDragOptions] = React.useState<DragItemOption>({});

  // if this fn returns => value it has valid field switch
  // if it return false , its used to check valid section switch
  const hasValidFieldMappingIndex = (data: GroupSectionData, index: number) => {
    const prevElement = data?.[index - 1];
    const nextElement = data?.[index + 1];

    if (prevElement?.seperatorGroup || nextElement?.sectionId) {
      return false;
    }
    return prevElement?.sectionId || prevElement?.groupedTo;
  };

  const handleFieldSwitch = (data: GroupSectionData, itemIndex: number) => {
    const sectionMapping = hasValidFieldMappingIndex(data, itemIndex);

    const orderedColIds: string[] = [];
    if (sectionMapping === data?.[itemIndex]?.groupedTo) {
      //When Swapping is inside same Section
      let sectionIndex = -1;
      data.forEach((colObj: SectionDataItem, index: number) => {
        if (colObj?.sectionId === sectionMapping) {
          sectionIndex = index;
        }
        if (colObj?.groupedTo === sectionMapping) {
          orderedColIds?.push(colObj?.id as string);
        }
      });
      data[sectionIndex] = Object.assign({}, data[sectionIndex], {
        colIds: orderedColIds,
      });
    } else {
      //When cross groupSwitch remove colId from existing froup and add it to new one
      let prevSectionIndex = -1;
      let currSectionIndex = -1;

      const prevSectionGroup = data?.[itemIndex]?.groupedTo;

      //Assign new Group
      data[itemIndex] = Object.assign({}, data[itemIndex], {
        groupedTo: sectionMapping,
      });

      data.forEach((colObj: SectionDataItem, index: number) => {
        if (colObj?.sectionId === sectionMapping) {
          currSectionIndex = index;
        }
        if (colObj?.sectionId === prevSectionGroup) {
          prevSectionIndex = index;
        }
        if (colObj?.groupedTo === sectionMapping) {
          orderedColIds.push(colObj?.id as string);
        }
      });

      //remove currColId from prevSection;
      data[prevSectionIndex] = Object.assign({}, data[prevSectionIndex], {
        colIds: data[prevSectionIndex]?.colIds?.filter?.(
          (id: string) => id !== data?.[itemIndex]?.id
        ),
      });

      //Assignt the colId to new Section Based On ordered Index
      data[currSectionIndex] = Object.assign({}, data[currSectionIndex], {
        colIds: orderedColIds,
      });
    }

    return data;
  };

  const handleSectionSwitch = (data: GroupSectionData) => {
    const prevSectionIndex = sectionFieldList?.findIndex?.(
      (item: any) => item?.sectionId === dragOptions?.id
    );

    let sectionIndex = -1;
    let firstSectionItemIndex = -1;

    let count = 0;
    data.forEach((item: any, index: number) => {
      if (item?.sectionId === dragOptions?.id) {
        sectionIndex = index;
      }
      if (
        firstSectionItemIndex < 0 &&
        (item?.groupedTo === dragOptions?.id ||
          item?.seperatorGroup === dragOptions?.id)
      ) {
        firstSectionItemIndex = index;
      }
      if (item?.groupedTo === dragOptions?.id) {
        count += 1;
      }
      if (item?.seperatorGroup === dragOptions?.id) {
        count += 1;
      }
    });
    if (
      prevSectionIndex === sectionIndex ||
      sectionIndex < 0 ||
      firstSectionItemIndex < 0
    ) {
      return;
    }
    //if valid field Mapping => !valid section mapping
    if (hasValidFieldMappingIndex(data, sectionIndex)) {
      return Alert.alert("Sections can't be nested.");
    }

    const listItems = data.splice(firstSectionItemIndex, count);
    sectionIndex = data.findIndex(
      (listObj: SectionDataItem) => listObj?.sectionId === dragOptions?.id
    );
    data.splice(sectionIndex + 1, 0, ...listItems);
    return data;
  };

  const saveDragCall = ({ data }: { data: GroupSectionData }) => {
    // Case :A - Once Section is created they only can be moved inside sections
    const hasSections = data?.some?.(
      (headerObj: SectionDataItem) => headerObj?.sectionId
    );
    if (hasSections) {
      // Case A.1 - Fields can onlybe placed inside sections
      let switchedData;
      if (dragOptions?.isSection) {
        switchedData = handleSectionSwitch(data);

        if (!switchedData) {
          return;
        }
      } else {
        const itemIndex = data?.findIndex?.(
          (item: SectionDataItem) => item?.id === dragOptions?.id
        );
        switchedData = handleFieldSwitch(data, itemIndex);
        if (!switchedData) {
          return;
        }
      }
      setSectionFieldList(() => switchedData);
      return;
    }
    //Case :B  - Else it should works on old Field Sort
    setSectionFieldList(() => data);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<SectionDataItem>) => {
    const index = getIndex?.();
    const isSection = item?.sectionId;
    const isSectionDragged =
      dragOptions?.isSection &&
      (item?.groupedTo === dragOptions?.id ||
        item?.seperatorGroup === dragOptions?.id);
    if (!item) {
      return null;
    }
    if (item?.isSeperator) {
      return (
        <View style={{ opacity: isSectionDragged ? 0 : 1 }}>
          {seperatorComponent({ isSectionDragged })}
        </View>
      );
    }

    const onDragPress = async () => {
      setDragOptions(() => ({
        isDragged: true,
        isSection: Boolean(isSection),
        id: isSection ? item?.sectionId : item?.id,
        groupedScreenStartIndex: isSection
          ? (sectionFieldList as SectionDataItem[])?.findIndex?.(
              (val) => val?.sectionId === item?.sectionId
            )
          : -1,
      }));
      await nextFrame(() => drag());
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (
      <TouchableOpacity
        onLongPress={onDragPress}
        onPress={
          item?.sectionId
            ? () => onSectionPress(item?.sectionId)
            : () => onItemPress(item?.id)
        }
        style={[
          {
            opacity: isSectionDragged ? 0 : 1,
            marginHorizontal: item?.groupedTo ? MARGIN.MEDIUM : 0,
          },
          renderItemStyle,
        ]}
      >
        {renderItemComponent({
          item,
          onDragPress,
          isSectionDragged,
          index,
          isActive,
        })}
      </TouchableOpacity>
    );
  };
  return (
    <DraggableFlatList
      style={{ backgroundColor: COLOR.GRAY100 }}
      showsVerticalScrollIndicator={false}
      data={sectionFieldList}
      renderItem={renderItem}
      keyExtractor={(item, index) => `draggable-item-${item?.id ?? index}`}
      onDragEnd={({ data }: { data: GroupSectionData }) => {
        saveDragCall({ data });
        setDragOptions({});
      }}
      initialNumToRender={20}
    />
  );
};

export default DraggableGroupList;
