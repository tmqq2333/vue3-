import { withInstall } from "@/utils/utils";
import TypeSelect from "./type-select/index.vue";
import TypeRadioGroup from "./type-radio-group/index.vue";
const sTypeSelect = withInstall(TypeSelect);
const sTypeRadioGroup = withInstall(TypeRadioGroup);
export { sTypeSelect, sTypeRadioGroup };
