import type { Dispatch, SetStateAction } from 'react';

export interface DragItemOption {
  groupedTo?: string;
  seperatorGroup?: string;
  isSection?: boolean;
  id?: string;
}

export type SectionDataItem = {
  id?: string;
  sectionId?: string;
  groupedTo?: string;
  colIds?: string[];
  seperatorGroup?: string;
  isSeperator?: boolean;
};

export type GroupSectionData = SectionDataItem[];

export type SeperatorItemType = {
  isSectionDragged: boolean;
};

export type FlatListGroupItem = {
  item: any;
  onDragPress: any;
  isSectionDragged: boolean;
  index: number;
  isActive: boolean;
};

export type FieldData = {
  id: string;
  title: string;
  text: string;
  sectionId?: string;
  colIds?: Array<string>;
}[];

export interface DraggableGroupListProps {
  sectionFieldList: (SectionDataItem | FieldData)[]; // Type of the state
  setSectionFieldList: Dispatch<
    SetStateAction<(SectionDataItem | FieldData)[]>
  >;
  seperatorComponent: ({
    isSectionDragged,
  }: SeperatorItemType) => React.JSX.Element;
  renderItemComponent: ({
    item,
    onDragPress,
    isSectionDragged,
    index,
    isActive,
  }: FlatListGroupItem) => React.JSX.Element;
}

export interface Section {
  sectionId: string;
  colIds?: string[];
  [key: string]: any;
}

export interface GroupedItem {
  groupedTo: string;
  [key: string]: any;
}

export interface Separator {
  type: 'separator';
  sectionId: string;
  [key: string]: any;
}

//utils
export type headerDataObject = {
  [key: string]: any;
};

export type AddSectionToList = {
  list: any[];
  sectionName: string;
  s_id: any;
};

export type DelSectionFromList = {
  list: any[];
  s_id: string;
  appendAtTop?: boolean;
};

export type EditSectionName = {
  list: any[];
  itemIndex: number;
  sectionName?: string;
};

export type GetSectionItem = {
  list: any[];
};

export type OrderedList = (Section | GroupedItem | Separator)[];
