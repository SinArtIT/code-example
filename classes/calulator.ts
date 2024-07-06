interface InitialValues {
  apartmentPrice: number | string;
  minApartmentPrice: number | string;
  maxApartmentPrice: number | string;

  loanPrice: number | string;
  maxLoanPrice: number | string;
  maxLoanPriceProgram: number | string;

  //...
}

type Initiator = "apartment" | "loan" | "initial" | null;
interface ICalculator {
  apartmentPrice: number;
  minApartmentPrice: number;
  maxApartmentPrice: number;

  loanPrice: number;
  minLoanPrice: number;
  maxLoanPrice: number;
  maxLoanPriceProgram: number;

  //...
}

export class Calculator implements ICalculator {
  apartmentPrice = 0;
  minApartmentPrice = 0;
  maxApartmentPrice = 0;

  loanPrice = 0;
  minLoanPrice = 0;
  maxLoanPrice = 0;
  maxLoanPriceProgram = 0;

  //...

  constructor(data: InitialValues) {
    this.apartmentPrice = Number(data.apartmentPrice);
    this.minApartmentPrice = Number(data.minApartmentPrice);
    this.maxApartmentPrice = Number(data.maxApartmentPrice);

    this.loanPrice = Number(data.loanPrice);
    this.maxLoanPriceProgram = Number(data.maxLoanPrice);
    this.setMinLoanPrice();
    this.setMaxLoanPrice();

    //...

    this.setMonthlyPayment();
  }

  setMonthlyPayment() {
    const monthRate = this.percent / 100 / 12;
    const exp1 = Math.pow(1 + monthRate, this.loanPeriod * 12);

    this.monthlyPayment = Math.floor(
      this.loanPrice * ((monthRate * exp1) / (exp1 - 1))
    );
  }

  setMinLoanPrice() {
    this.minLoanPrice = Math.floor(
      Number(this.apartmentPrice) * this.minLoanShare
    );
  }

  setMaxLoanPrice() {
    this.maxLoanPrice = Math.floor(
      Math.min(
        Number(this.maxLoanPriceProgram),
        (Number(this.apartmentPrice) * (100 - Number(this.initialPercentFee))) /
          100
      )
    );
  }

  //...
}