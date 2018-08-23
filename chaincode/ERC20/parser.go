package main

import "fmt"

/* ************************************************************************** */
/*		PRIVATE																  */
/* ************************************************************************** */

func	checkNil(argv []string) error {
	for index, _ := range argv {
		if argv[index] == "" {
			return fmt.Errorf("Parse Error")
		}
	}

	return nil
}

func		usage(typeofTx string) error {
	switch typeofTx {
		case "transfer":
			return fmt.Errorf("Transfer: [address to] [uint tokens]")
		case "transferFrom":
			return fmt.Errorf("TransferFrom: [address from] [address to] [uint tokens]")
		case "approve":
			return fmt.Errorf("Approve: [address spender] [uint tokens]")
	}

	return nil
}

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func	parseArgv(argv []string, typeofTx string, num int) error {
	var err	error

	if len(argv) != num {
		return usage(typeofTx)
	}
	if err = checkNil(argv); err != nil {
		return err
	}

	return nil
}
