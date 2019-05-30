package main

import "github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// STRUCTURES
////////////////////////////////////////////////////////////////////////////////

type SimpleAsset struct {
}

//////////////////////////////////////////////////
/// USERS
//////////////////////////////////////////////////

type User struct {
	DocType string
}

//type UserLastBought		struct {
//	Id					string
//	Shop				string
//	Price				uint64
//	Quantity			uint64
//}
//
//type UserLastOffer		struct {
//	Id					string
//	Shop				string
//	Offer				uint64
//}

type Sale struct {
	User      string
	ItemId    string
	ShopId    string
	Price     uint64
	Quantity  uint64
	StateShop uint8 // When both states are TRUE,
	StateUser uint8 // the Sale key is deleted.
	DocType   string
}

type SaleSubmission struct {
	ItemId   string
	ShopId   string
	Quantity uint64
}

type SalesSubmission []SaleSubmission

//////////////////////////////////////////////////
/// SHOP
//////////////////////////////////////////////////

type Shop struct {
	Name         string
	Users        []string
	Items        []string // Will be useless with couchdb
	Raw          []string // Will be useless with couchdb
	DocType      string
	ERC20Address string
}

type ShippingFee struct {
	To  string
	Fee uint64
}

type ShopItem struct {
	ReservePrice uint64
	Biddable     bool
	DocType      string
	Pictures     []string
	Shipping     []ShippingFee
	Name         string
	Detail       string
	Price        uint64
	Quantity     uint64
	MinQuantity  uint64
	CreationDate uint64
	ExpireDate   uint64
	ShopId       string
	BidList      []string
	Winner       string
	Latitude     float64
	Longitude    float64
	Weight       int
	City         string
	Uploader     string
}

type ShopItemSubmission struct {
	Shipping     []ShippingFee
	Bidable      bool
	Pictures     []string
	Name         string
	City         string
	Detail       string
	Price        uint64
	Quantity     uint64
	MinQuantity  uint64
	Duration     uint64
	Latitude     float64
	Longitude    float64
	Weight       int
	ReservePrice uint64
}

type ShopRaw struct {
	RawId            string
	Price            uint64
	Quantity         uint64
	MinQuantity      uint64
	AdditionalFields string
	ShopId           string
	DocType          string
}

type ShopRawSubmission struct {
	RawId            string
	Price            uint64
	Quantity         uint64
	MinQuantity      uint64
	AdditionalFields string
}

type Bid struct {
	ItemId     string
	Price      uint64
	DocType    string
	Owner      string
	ShownPrice uint64
	Timestamp  uint64
}

type BidSubmission struct {
	ItemId string
	Price  uint64
}

//////////////////////////////////////////////////
/// RAW
//////////////////////////////////////////////////

type Raw struct {
	Pictures []string
	Name     string
	Detail   string
	DocType  string
}

type RawSubmission struct {
	Name     string
	Detail   string
	Pictures []string
}

type AdminList []string

////////////////////////////////////////////////////////////////////////////////
/// GLOBAL VARIABLES
////////////////////////////////////////////////////////////////////////////////

const devKeyAdmin = "ADMIN"

var STUB shim.ChaincodeStubInterface
var LOG *shim.ChaincodeLogger
