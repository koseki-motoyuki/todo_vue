import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component
export default class MixinCommon extends Vue {
  formatDate (date: string): string {
    return dayjs(date).format('YYYY/MM/DD')
  }
}
