import { uniq } from 'lodash'

const LABEL_SEPARATOR = ','

/**
 * Sorts unique labels and merges them with the label separator
 * @param labels
 */
export function mergeSetLabels(labels: string[]) {
  return uniq(labels)
    .sort()
    .join(LABEL_SEPARATOR)
}

/**
 * Checks if a merged label contains a label
 * @param mergedLabel
 * @param label
 */
export function mergedLabelContains(mergedLabel: string, label: string) {
  return mergedLabel.split(LABEL_SEPARATOR).includes(label)
}

export function checkIfTranstitionExists() {}
