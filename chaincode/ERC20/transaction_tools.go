package main

/* ************************************************************************** */
/*		PRIVATE																  */
/* ************************************************************************** */

func	_transfer(ptr *UserInfos, to string, amount uint64) {
	(*ptr).Amount -= amount
}

func	_transferFrom(ptr *UserInfos, to string, amount uint64) {
	(*ptr).Amount -= amount

	test, err := getPublicKey()
	if (err != nil) {
		return
	}
	(*ptr).Allowances[test] -= amount

	if (*ptr).Allowances[test] == 0 {
		delete((*ptr).Allowances, test)
	}
}

func	_approve(ptr *UserInfos, to string, amount uint64) {
	(*ptr).Allowances[to] += amount

	if amount == 0 {
		delete((*ptr).Allowances, to)
	}
}

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func changeStateTo(tx Transaction) error {
	var user UserInfos
	var err error

	if user, err = getUserInfos(tx.To); err == nil {
		user.Amount += tx.Amount
	} else {
		user.Amount = tx.Amount
		user.Allowances = make(map[string]uint64)
	}

	if err = user.Set(tx.To); err != nil {
		return err
	}

	return nil
}

func changeStateFrom(tx Transaction, fct func(ptr *UserInfos, to string, amount uint64)) error {
	var err error

	fct(&tx.User, tx.To, tx.Amount)
	if err = tx.User.Set(tx.From); err != nil {
		return err
	}

	return nil
}
