package	main

import	"github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// STRUCTURES
////////////////////////////////////////////////////////////////////////////////

type	SimpleAsset	struct {
}

//////////////////////////////////////////////////
/// USERS
//////////////////////////////////////////////////

type User struct {
	Shops   map[string]bool
	DocType string
}

type UserLastBought struct {
	Id       string
	Shop     string
	Price    uint64
	Quantity uint64
}

type UserLastOffer struct {
	Id    string
	Shop  string
	Offer uint64
}

//////////////////////////////////////////////////
/// SHOP
//////////////////////////////////////////////////

type Shop struct {
	Name    string
	Items   []string
	DocType string
}

type ShopItemSubmission struct {
	Bidable  bool
	Picture  string
	Name     string
	Detail   string
	Price    uint64
	Quantity uint64
	Duration uint64
}

type ShopItem struct {
	Biddable   bool
	DocType    string
	Picture    string
	Name       string
	Detail     string
	Price      uint64
	Quantity   uint64
	ExpireDate uint64
	ShopId     string
	BidList    []string
}

type Bid struct {
	ItemId    string
	Price     uint64
	DocType   string
	Owner     string
	Timestamp uint64
}

type BidSubmission struct {
	ItemId string
	Price  uint64
}

type ShopLastSold struct {
	Id       string
	Price    uint64
	Quantity uint64
	User     string
}

type ShopLastOffer struct {
	Id    string
	Offer uint64
	User  string
}

//////////////////////////////////////////////////
/// RAW
//////////////////////////////////////////////////

type Raw			struct {
	Picture			string
	Name			string
	Detail			string
	DocType			string
}

type RawSubmission	struct {
	Name			string
	Detail			string
	Picture			string
}

type AdminList []string

////////////////////////////////////////////////////////////////////////////////
/// GLOBAL VARIABLES
////////////////////////////////////////////////////////////////////////////////

const	devKeyAdmin = "ADMIN"
var		STUB		shim.ChaincodeStubInterface
var		LOG			*shim.ChaincodeLogger
