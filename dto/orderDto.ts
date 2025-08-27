export class OrderDto {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string

  constructor(status: string, courierId: number, customerName: string, customerPhone: string, comment: string) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
  }
}