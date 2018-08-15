package main

import	"fmt"
import "strconv"

/* ************************************************************************** */
/*		PRIVATE																  */
/* ************************************************************************** */

func (self Transaction) ParseApprove() (Transaction, error) {
	if self.From == self.To {
		return Transaction{}, fmt.Errorf("Approve: illegal operation")
	}

	return self, nil
}

func getApproveTx(argv []string) (Transaction, error) {
	var publicKey	string
	var amount		uint64
	var user		UserInfos
	var err			error

	if publicKey, err = getPublicKey(); err != nil {
		return Transaction{}, err
	}
	if amount, err = strconv.ParseUint(argv[1], 10, 64); err != nil {
		return Transaction{}, err
	}
	if user, err = getUserInfos(publicKey); err != nil {
		return Transaction{}, err
	}

	return (Transaction{publicKey, argv[0], amount, user}).ParseApprove()
}

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func approve(argv []string) (string, error) {
	var tx		Transaction
	var err		error

	if err = parseArgv(argv, "approve", 2); err != nil {
		return "", err
	}
	if tx, err = getApproveTx(argv); err != nil {
		return "", err
	}

	if err = changeStateFrom(tx, _approve); err != nil {
		return "", err
	}
	if err = event(tx.From, tx.To, tx.Amount, "approval"); err != nil {
		return "", err
	}

	LOG.Info("Successfull call to approve") // LOG
	LOG.Info("Spender:", argv[0])
	LOG.Info("Tokens:", argv[1])

	return fmt.Sprintf("Successfull approval"), nil
}
