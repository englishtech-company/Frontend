import Swal from "sweetalert2";

type ConfirmDeleteOptions = {
  entityLabel: string;
  itemName: string;
  message?: string;
};

type ConfirmDeleteWithReasonOptions =
  ConfirmDeleteOptions & {
    reasonLabel?: string;
    reasonPlaceholder?: string;
  };

function raiseConfirmationAboveModals() {
  const container = Swal.getContainer();

  if (!container) {
    return;
  }

  container.style.zIndex = "3000";
}

type ConfirmActionOptions = {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
};

export async function confirmDelete(
  options: ConfirmDeleteOptions
): Promise<boolean> {
  const { entityLabel, itemName, message } =
    options;

  const result = await Swal.fire({
    icon: "warning",
    title: `Excluir ${entityLabel}?`,
    text:
      message ??
      `Deseja remover "${itemName}"? Esta ação não pode ser desfeita.`,
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#600022",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    focusCancel: true,
    didOpen: raiseConfirmationAboveModals,
  });

  return result.isConfirmed;
}

export async function confirmDeleteWithReason(
  options: ConfirmDeleteWithReasonOptions
): Promise<string | null> {
  const {
    entityLabel,
    itemName,
    message,
    reasonLabel = "Motivo da exclusão",
    reasonPlaceholder =
      "Informe por que este registro está sendo excluído.",
  } = options;

  const result = await Swal.fire({
    icon: "warning",
    title: `Excluir ${entityLabel}?`,
    text:
      message ??
      `Deseja remover "${itemName}"? Esta ação não pode ser desfeita.`,
    input: "textarea",
    inputLabel: reasonLabel,
    inputPlaceholder: reasonPlaceholder,
    inputAttributes: {
      maxlength: "2000",
      autocapitalize: "sentences",
    },
    inputValidator: (value) => {
      if (!value.trim()) {
        return "Informe o motivo da exclusão.";
      }

      return null;
    },
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#600022",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    focusCancel: true,
    didOpen: raiseConfirmationAboveModals,
  });

  if (
    !result.isConfirmed ||
    typeof result.value !== "string"
  ) {
    return null;
  }

  const reason = result.value.trim();

  return reason || null;
}

export async function confirmAction(
  options: ConfirmActionOptions
): Promise<boolean> {
  const result = await Swal.fire({
    icon: "warning",
    title: options.title,
    text: options.message,
    showCancelButton: true,
    confirmButtonText:
      options.confirmButtonText,
    cancelButtonText:
      options.cancelButtonText ?? "Voltar",
    confirmButtonColor:
      options.confirmButtonColor ?? "#600022",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}
