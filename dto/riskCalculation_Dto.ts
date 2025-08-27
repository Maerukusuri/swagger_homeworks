export class OrderDto {
    income: number
    debt: number
    age: number
    employed: boolean
    loanAmount: number
    loanPeriod: number

    constructor(income: number, debt: number, age: number, loanAmount: number, loanPeriod: number) {
        this.income = income
        this.debt = debt
        this.age = age
        this.employed = true
        this.loanAmount = loanAmount
        this.loanPeriod = loanPeriod
    }
}