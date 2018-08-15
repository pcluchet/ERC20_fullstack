package main

import "fmt"
import "strconv"

/* ************************************************************************** */
/*		PRIVATE																  */
/* ************************************************************************** */

func	(self Transaction) ParseTransferFrom(publicKey string) (Transaction, error) {
	if self.From == self.To {
		return Transaction{}, fmt.Errorf("TransferFrom: illegal operation")
	}
	if self.Amount <= self.User.Allowances[publicKey] && self.Amount <= self.User.Amount {
		return self, nil
	}

	return Transaction{}, fmt.Errorf("TransferFrom: permission denied")
}

func	getTransferFromTx(argv []string) (Transaction, error) {
	var publicKey	string
	var amount		uint64
	var user		UserInfos
	var err			error

	if publicKey, err = getPublicKey(); err != nil {
		return Transaction{}, err
	}
	if amount, err = strconv.ParseUint(argv[2], 10, 64); err != nil {
		return Transaction{}, err
	}
	if user, err = getUserInfos(argv[0]); err != nil {
		return Transaction{}, err
	}

	return (Transaction{argv[0], argv[1], amount, user}).ParseTransferFrom(publicKey)
}

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func	transferFrom(argv []string) (string, error) {
	var tx		Transaction
	var err		error

	if err = parseArgv(argv, "transferFrom", 3); err != nil {
		return "", err
	}
	if tx, err = getTransferFromTx(argv); err != nil {
		return "", err
	}

	if err = changeStateFrom(tx, _transferFrom); err != nil {
		return "", err
	}
	if err = changeStateTo(tx); err != nil {
		return "", err
	}
	if err = event(tx.From, tx.To, tx.Amount, "transfer"); err != nil {
		return "", err
	}

	LOG.Info("Successfull call to transferFrom") // LOG
	LOG.Info("From:", argv[0])
	LOG.Info("To:", argv[1])
	LOG.Info("Tokens:", argv[2])

	return fmt.Sprintf("Successfull transaction"), nil
}
