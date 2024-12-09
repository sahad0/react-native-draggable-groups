import { has, isEmpty, omit } from 'lodash';
import type {
  AddSectionToList,
  DelSectionFromList,
  EditSectionName,
  FieldData,
  GetSectionItem,
  GroupedItem,
  headerDataObject,
  OrderedList,
  Section,
  SectionDataItem,
} from '../types/types';

const nextFrame = (
  callback?: () => void,
  numberOfFrames: number = 1
): Promise<void> => {
  try {
    let promise: Promise<void> = Promise.resolve();

    Array.from({ length: numberOfFrames }).forEach(() => {
      promise = promise.then(
        () =>
          new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      );
    });

    return promise.then(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  } catch (err) {
    console.error('Error in nextFrame:', err);
    return Promise.reject(err);
  }
};

const getSeperatorObj = (sectionId: string): any => {
  return {
    isSeperator: true,
    seperatorGroup: sectionId,
  };
};

const getOrderedSectionListWithSeperators = (
  headerDataAsObj: headerDataObject = {},
  sections: Section[] = []
): OrderedList => {
  return sections.reduce((arr: OrderedList, currObj: Section) => {
    arr.push(currObj);
    currObj.colIds
      ?.filter((colId) => has(headerDataAsObj, colId))
      ?.forEach((colId) => {
        const groupedItem: GroupedItem = {
          ...headerDataAsObj[colId],
          groupedTo: currObj.sectionId,
        };
        arr.push(groupedItem);
      });
    arr.push(getSeperatorObj(currObj.sectionId));
    return arr;
  }, []);
};

const getInitialFieldList = ({
  headerData = [],
  sections = [],
  headerDataAsObj = {},
}) => {
  if (isEmpty(sections)) {
    return headerData;
  }
  return getOrderedSectionListWithSeperators(headerDataAsObj, sections);
};

const getSectionObj = (sectionId: string, name: string, colIds: Array<any>) => {
  return {
    sectionId,
    sectionName: name,
    colIds,
  };
};

const addSectionToList = ({
  list,
  sectionName,
  s_id,
}: AddSectionToList): (SectionDataItem | FieldData)[] | [] => {
  if (sectionName && s_id) {
    const fieldList = [...list];
    fieldList.splice(
      0,
      0,
      getSectionObj(s_id, sectionName, []),
      getSeperatorObj(s_id)
    );
    return fieldList; // Return the updated list
  }
  return list; // Return the original list if no sectionName is provided
};

const deleteSectionFromList = ({
  list,
  s_id,
  appendAtTop,
}: DelSectionFromList): SectionDataItem[] | [] => {
  const deletionIndex = list?.findIndex(
    (listObj) => listObj?.sectionId === s_id
  );
  if (s_id && deletionIndex > -1) {
    const sectionObj = list[deletionIndex];
    const currentList = [...list];
    const itemsToRemove = sectionObj?.colIds?.length
      ? sectionObj.colIds.length + 2
      : 1;
    currentList.splice(deletionIndex, itemsToRemove);
    const refactoredList = list
      .slice(deletionIndex, deletionIndex + itemsToRemove)
      .reduce<SectionDataItem[]>((arr, curr) => {
        if (curr?.sectionId || curr?.isSeperator) {
          return arr;
        }
        const newItem = omit(curr, 'groupedTo') as SectionDataItem;
        arr.push(newItem);
        return arr;
      }, []);
    if (appendAtTop) {
      return [...refactoredList, ...currentList];
    }
    return [...currentList, ...refactoredList];
  }
  return list;
};

const editSectionName = ({ list, itemIndex, sectionName }: EditSectionName) => {
  const listGroup = list?.slice?.() ?? [];
  listGroup[itemIndex].sectionName = sectionName;
  return listGroup;
};

// const getCircularReplacer = () => {
//   const seen = new WeakSet();
//   return (key: number, value: object) => {
//     if (typeof value === 'object' && value !== null) {
//       if (seen.has(value)) {
//         return;
//       }
//       seen.add(value);
//     }
//     return value;
//   };
// };

const getAvailableSections = ({ list = [] }: GetSectionItem) => {
  return list?.filter((listObj) => listObj?.sectionId);
};

export {
  nextFrame,
  getInitialFieldList,
  getSeperatorObj,
  getSectionObj,
  addSectionToList,
  getOrderedSectionListWithSeperators,
  deleteSectionFromList,
  editSectionName,
  getAvailableSections,
};
