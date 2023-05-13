import React, { Component } from "react";
import MoneyDataService from "../services/money.service";
import { withRouter } from "../common/with-router";
import { MdCheck } from "react-icons/md";

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
        lastChangeDesc: []
      },
      deposit: 0,
      withdraw: 0,
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
  
    const newMoney = {
      id: this.state.currentMoney.id,
      balance: newBalance,
      lastChangeDesc: this.state.currentMoney.lastChangeDesc,
    };
  
    MoneyDataService.update(newMoney.id, newMoney)
      .then((response) => {
        console.log(response.data);
        this.setState({
          currentMoney: newMoney,
          message: "The money management was updated successfully!",
          deposit: 0,
          withdraw: 0,
        });
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
    // console.log(currentMoney);

    const formatCurrency = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
  
      return formatter.format(value);
    };

    return (
      <div>
        {currentMoney ? (
          <div className="edit-form">
            <h4>Money Discipline</h4>
            <form>
              <div className="form-group">
                <label htmlFor="balance">Balance</label>
                <input
                  type="text"
                  className="form-control"
                  id="balance"
                  value={formatCurrency(currentMoney.balance)}
                  onChange={this.onChangeBalance}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <input
                  type="text"
                  className="form-control"
                  id="deposit"
                  value={this.state.deposit}
                  onChange={this.onChangeDeposit.bind(this)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="withdraw">Withdraw</label>
                <input
                  type="text"
                  className="form-control"
                  id="withdraw"
                  value={this.state.withdraw}
                  onChange={this.onChangeWithdraw.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastChangeDesc">History</label>
                <textarea
                  className="form-control"
                  id="lastChangeDesc"
                  value={currentMoney.lastChangeDesc}
                  onChange={this.onChangeLastChangeDesc}
                  name="lastChangeDesc"
                  rows="5"
                  cols="50"
                ></textarea>
              </div>
            </form>

            <button onClick={this.updateMoney} className="btn btn-success mr-2 btn-icon">
              <MdCheck className="icon"/> Update
            </button>
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
