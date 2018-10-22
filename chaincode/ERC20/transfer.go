package main

import "fmt"
import "strconv"

/* ************************************************************************** */
/*		PRIVATE																  */
/* ************************************************************************** */

func (self Transaction) ParseTransfer() (Transaction, error) {
	if self.From == self.To {
		return Transaction{}, fmt.Errorf("Transfer: illegal operation, one can't transfer tokens to himself")
	}
	if self.Amount <= self.User.Amount {
		return self, nil
	}

	return Transaction{}, fmt.Errorf("Transfer: permission denied, (insufficient funds ?)")
}

func getTransferTx(argv []string) (Transaction, error) {
	var publicKey string
	var amount uint64
	var user UserInfos
	var err error

	if publicKey, err = getPublicKey(); err != nil {
		return Transaction{}, err
	}
	if amount, err = strconv.ParseUint(argv[1], 10, 64); err != nil {
		return Transaction{}, err
	}
	if user, err = getUserInfos(publicKey); err != nil {
		return Transaction{}, err
	}

	return (Transaction{publicKey, argv[0], amount, user}).ParseTransfer()
}

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func transfer(argv []string) (string, error) {
	var tx Transaction
	var err error

	if err = parseArgv(argv, "transfer", 2); err != nil {
		return "", err
	}
	if tx, err = getTransferTx(argv); err != nil {
		return "", err
	}

	if err = changeStateFrom(tx, _transfer); err != nil {
		return "", err
	}
	if err = changeStateTo(tx); err != nil {
		return "", err
	}
	if err = event(tx.From, tx.To, tx.Amount, "transfer"); err != nil {
		return "", err
	}

	LOG.Info("Successfull call to transfer") // LOG
	LOG.Info("To:", argv[0])
	LOG.Info("Tokens:", argv[1])

	return fmt.Sprintf("Successfull transaction"), nil
}
