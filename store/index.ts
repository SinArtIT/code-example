interface State {
  active_modals: (number | string)[];
  is_filter_active: boolean;
  is_mobile_menu_open: boolean;
  is_questionnaire_show: boolean;
  is_questionnaire_hide_permanently: boolean;
  questionnaire_interval: ReturnType<typeof setTimeout> | null;
}

export const useStore = defineStore("index", {
  state: (): State => ({
    active_modals: [],
    is_filter_active: false,
    is_mobile_menu_open: false,
    is_questionnaire_show: false,
    is_questionnaire_hide_permanently: false,
    questionnaire_interval: null
  }),
  getters: {
    hasActiveModals(state: State): boolean {
      return !!state.active_modals.length;
    },
    isMobileMenuOpen(state: State): boolean {
      return state.is_mobile_menu_open;
    },
    isQuestionnaireHidePermanently(state: State): boolean {
      return state.is_questionnaire_hide_permanently;
    },
    isQuestionnaireShow(state: State): boolean {
      return state.is_questionnaire_show;
    }
  },
  actions: {
    addActiveModal(modalId: number | string) {
      if (modalId) this.active_modals.push(modalId);
    },
    deInitQuestionnaire() {
      if (!process.client) return;
      if (this.questionnaire_interval)
        window.clearTimeout(this.questionnaire_interval);

      window.localStorage.setItem("isQuestionnaireShow", "0");
    },
    initQuestionnaire() {
      if (!process.client || this.isQuestionnaireHidePermanently) return;

      window.localStorage.getItem("isQuestionnaireShow");

      if (Number(window.localStorage.getItem("isQuestionnaireShow")))
        window.localStorage.setItem("isQuestionnaireShow", "0");

      const TIMER_DELAY = 8 * 60 * 1000;

      this.questionnaire_interval = setTimeout(() => {
        if (!Number(window.localStorage.getItem("isQuestionnaireShow")))
          this.setIsQuestionnaireShow(true);
      }, TIMER_DELAY);
    },
    removeActiveModal(id: number | string) {
      if (id)
        this.active_modals = this.active_modals.filter(
          (item: number | string) => item.toString() !== id.toString()
        );
    },
    setIsFilterActive(val: boolean) {
      this.is_filter_active = val;
    },
    setIsMobileMenuOpen(val: boolean) {
      this.is_mobile_menu_open = val;
    },
    setIsQuestionnaireHidePermanently(val: boolean) {
      this.is_questionnaire_hide_permanently = val;
    },
    setIsQuestionnaireShow(val: boolean) {
      this.is_questionnaire_show = val;
      if (process.client)
        window.localStorage.setItem("isQuestionnaireShow", val ? "1" : "0");
    }
  }
});
