import React, { Component } from "react";
import MoneyDataService from "../services/money.service";
import { withRouter } from "../common/with-router";
import Swal from "sweetalert2"

class Money extends Component {
  constructor(props) {
    super(props);
    this.onChangeBalance = this.onChangeBalance.bind(this);
    this.onChangeLastChangeDesc = this.onChangeLastChangeDesc.bind(this);
    this.getMoney = this.getMoney.bind(this);
    this.updateMoney = this.updateMoney.bind(this);
    this.deleteMoney = this.deleteMoney.bind(this);

    this.state = {
      currentMoney: {
        id: null,
        balance: "",
        lastChangeDesc: [],
        balanceDesc: [],
        time: []
      },
      deposit: 0,
      withdraw: 0,
      historyDesc: "",
      balanceChange: "",
      message: "",
    };
  }

  componentDidMount() {
    this.getMoney(this.props.router.params.id);
  }

  onChangeBalance(e) {
    const balance = e.target.value;

    this.setState(function (prevState) {
      return {
        currentMoney: {
          ...prevState.currentMoney,
          balance: balance,
        },
      };
    });
  }

  onChangeLastChangeDesc(e) {
    const lastChangeDesc = e.target.value.split("\n");
    this.setState((prevState) => ({
      currentMoney: {
        ...prevState.currentMoney,
        lastChangeDesc: lastChangeDesc,
      },
    }));
  }  
  
  onChangeDeposit(e) {
    const deposit = e.target.value;
    this.setState({ deposit });
  }
  
  onChangeWithdraw(e) {
    const withdraw = e.target.value;
    this.setState({ withdraw });
  }

  onChangeHistoryDesc(e){
    const historyDesc = e.target.value;
    this.setState({ historyDesc })
  }

  onChangeBalanceChange(e){
    const balanceChange = e.target.value;
    this.setState({ balanceChange });
  }

  getMoney(id) {
    MoneyDataService.get(id)
      .then((response) => {
        this.setState({
          currentMoney: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }  

  updateMoney() {
    // Check if historyDesc is empty or ""
    if (!this.state.historyDesc) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Message is required',
      });
      return;
    }

    const formatCurrency = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
  
      return formatter.format(value);
    };
    
    const newBalance =
      parseInt(this.state.currentMoney.balance) +
      parseInt(this.state.deposit) -
      parseInt(this.state.withdraw);
    
    // Validation check
    if (parseInt(this.state.withdraw) > parseInt(this.state.currentMoney.balance)) {
      this.setState({
        message: "Withdrawal amount cannot be greater than the current balance",
        withdraw: 0,
      });
      return;
    }

    let balanceChange = "";
    if (this.state.deposit !== 0) {
      balanceChange = "+" + formatCurrency(this.state.deposit);
    } else if (this.state.withdraw !== 0) {
      balanceChange = "-" + formatCurrency(this.state.withdraw);
    }
  
    const newMoney = {
      id: this.state.currentMoney.id,
      balance: newBalance,
      historyDesc: this.state.historyDesc,
      balanceChange: balanceChange
    };
  
    MoneyDataService.update(newMoney.id, newMoney)
    .then((response) => {
      console.log(response.data);
      const updatedMoney = response.data;
      const updatedHistoryDesc = updatedMoney.lastChangeDesc;
      const updatedBalanceChange = updatedMoney.balanceDesc;
      const updatedTime = updatedMoney.time;
      // Only update the necessary properties in the currentMoney object
      this.setState((prevState) => ({
        currentMoney: {
          ...prevState.currentMoney,
          balance: newMoney.balance,
          lastChangeDesc: updatedHistoryDesc,
          balanceDesc: updatedBalanceChange,
          time: updatedTime,
        },
        message: "The money management was updated successfully!",
        deposit: 0,
        withdraw: 0,
        historyDesc: "",
        balanceChange: "",
      }));
    })
    .catch((e) => {
      console.log(e);
    });
  }
  

  deleteMoney() {
    if (window.confirm("Are you sure to delete this Money Management?")) {
      MoneyDataService.delete(this.state.currentMoney.id)
        .then((response) => {
          console.log(response.data);
          // this.props.router.navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  render() {
    const { currentMoney } = this.state;

    const formatCurrency = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
  
      return formatter.format(value);
    };

    const handleDeposit = () => {
      Swal.fire({
        title: "Deposit",
        html:
          '<input type="number" id="depositAmount" min="0" step="1000" class="swal2-input" placeholder="Enter deposit amount">' +
          '<input type="text" id="message" class="swal2-input" placeholder="Enter message">',
        showCancelButton: true,
        confirmButtonText: "Deposit",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const depositAmount = parseInt(document.getElementById("depositAmount").value);
          const message = document.getElementById("message").value;
          // Set the deposit amount and message in the state
          this.setState({ deposit: depositAmount, historyDesc: message }, () => {
            this.updateMoney();
          });
          // Return a Promise that resolves when the deposit is successful
          // return new Promise.resolve();
          return
        },
        // allowOutsideClick: () => !Swal.isLoading(),
      });
    };
    
    const handleWithdraw = () => {
      Swal.fire({
        title: "Withdraw",
        html:
          '<input type="number" id="withdrawAmount" min="0" max="' +
          currentMoney.balance +
          '" step="1000" class="swal2-input" placeholder="Enter withdraw amount" style="width: 260px; height: 50px;">' +
          '<input type="text" id="message" class="swal2-input" placeholder="Enter message">',
        showCancelButton: true,
        confirmButtonText: "Withdraw",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const withdrawAmount = parseInt(document.getElementById("withdrawAmount").value);
          const message = document.getElementById("message").value;
          // Set the withdraw amount and message in the state
          this.setState({ withdraw: withdrawAmount, historyDesc: message }, () => {
            this.updateMoney();
          });
          // Return a Promise that resolves when the withdraw is successful
          // return new Promise.resolve();
          return
        },
        // allowOutsideClick: () => !Swal.isLoading(),
      });
    };
    

    return (
      <div>
        {currentMoney ? (
          <div className="edit-form">
            <h4 className="text-center" style={{fontWeight:"bold"}}>
              Your Money
            </h4>
            <h4 className="text-center" style={{fontSize:"36px"}}>
              <u>{formatCurrency(currentMoney.balance)}</u>
            </h4>

            <div className="text-center mt-4">
              <button onClick={handleDeposit} className="btn btn-primary mr-2">
                Deposit
              </button>
              <button onClick={handleWithdraw} className="btn btn-danger">
                Withdraw
              </button>
            </div>

            <form>
              <div className="form-group">
                <label htmlFor="time">History</label>
                <table className="table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Description</th>
                      <th>Change</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMoney.lastChangeDesc.map((desc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{desc}</td>
                        <td>{currentMoney.balanceDesc[index]}</td>
                        <td>
                          {new Date(currentMoney.time[index]).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Money List...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Money);