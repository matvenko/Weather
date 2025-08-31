import { Modal } from "antd";

export function checkValueExists(array, value) {
  return array.some((item) => item.value === value);
}

export function checkIfActionExists(actionsList, targetAction) {
  return actionsList.some((item) => item.action === targetAction);
}

export function checkStatusForSelectedItems(
  groupList,
  selectedRowKeys,
  requiredStatus,
) {
  const selectedItems = groupList.filter((item) =>
    selectedRowKeys.includes(item.parcelGroupId),
  );
  return selectedRowKeys.length > 0
    ? selectedItems.every((item) => item.status === requiredStatus)
    : false;
}

export function getArrayItemValueById(array, element, eId, returnElement) {
  const result = array.filter(function (e) {
    return element === e[eId];
  });
  if (result[0]) {
    const res =
      typeof result[0][returnElement] !== "undefined"
        ? result[0][returnElement]
        : "";
    return res;
  }
  return "";
}

export async function generalApiCallHandler(service, params, successCallback) {
  try {
    const result = await service({ ...params }).unwrap();

    if (result.type === "success") {
      Modal.success({
        title: result.message,
        content: "",
        onOk: successCallback,
      });
    }
  } catch (err) {
    if (!err) {
      Modal.success({ title: "Error", content: "No Server Response!" });
    } else {
      Modal.error({ title: "Error", content: err.data.message });
    }
  }
}

/**
 * A general delete handler function that handles API deletion requests.
 * This function is abstracted for reusability across different delete operations.
 *
 * @param {Function} deleteService - A service function that performs the delete operation.
 * @param {Object} deleteParams - The parameters to be passed to the delete service.
 * @param {Function} successCallback - A callback function that will be executed after a successful deletion.
 *
 * @return {Void}
 */
export async function generalDeleteHandler(
  deleteService,
  deleteParams,
  successCallback,
) {
  try {
    const result = await deleteService({ ...deleteParams }).unwrap();
    if (result.type === "success") {
      Modal.success({
        title: result.message,
        content: "",
        onOk: successCallback,
      });
    }
  } catch (err) {
    if (!err) {
      Modal.success({ title: "Error", content: "No Server Response!" });
    } else {
      Modal.error({ title: "Error", content: err.data.message });
    }
  }
}

/**
 * A general function for performing add or edit operations.
 * This function handles setting the loading state, calling the provided service, and showing the result in a modal.
 *
 * @param {Function} serviceName - A service function that performs the operation.
 * @param {Object} data - The data to be passed to the service.
 * @param {Function} setLoading - An optional function to set the loading state.
 * @param {Function} onSuccess - An optional function to be called on successful operation.
 *
 * @return {Void}
 */
export async function generalAddOrEditHandler(
  serviceName,
  data,
  setLoading,
  onSuccess,
) {
  if (setLoading) setLoading(true);

  try {
    const result = await serviceName(data).unwrap();
    if (result.type === "success") {
      Modal.success({
        title: result.message,
        content: "",
        onOk: onSuccess, // Called when user clicks "OK"
      });
    }

    if (setLoading) setLoading(false);
  } catch (err) {
    Modal.error({
      title: "Error",
      content: err.data.message,
    });
    if (setLoading) setLoading(false);
  }
}

export async function customRequest(options) {
  const { file, onSuccess, onProgress } = options;
  try {
    // Simulate file upload progress
    let progress = 0;
    while (progress < 100) {
      progress += 10;
      onProgress({ percent: progress }, file);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    onSuccess(console.log("File uploaded successfully"));
  } catch (error) {
    console.error("File upload failed:", error);
  }
}

export function generalOpenDrawer(setDrawerVisibility) {
  setDrawerVisibility(true);
}

export function generalCloseDrawer(setDrawerVisibility) {
  setDrawerVisibility(false);
}
