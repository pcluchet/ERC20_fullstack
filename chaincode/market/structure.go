package main

type Base			struct {}

////////////////////////////////////////////////////////////////////////////////
/// USERS
////////////////////////////////////////////////////////////////////////////////

type User			struct {
	Shops			[]string
}

type UserLastBought	struct {
	Id				string
	Shop			string
	Price			uint64
	Quantity		uint64
}

type UserLastOffer	struct {
	Id				string
	Shop			string
	Offer			uint64
}

////////////////////////////////////////////////////////////////////////////////
/// SHOP
////////////////////////////////////////////////////////////////////////////////

type Shop			struct {
	Name			string
	Users			[]string
	Items			[]string
}

type ShopItem		struct {
	Name			string
	Detail			string
	Price			uint64
	Quantity		uint64
	IsUnique		bool
	BidLimit		string
}

type ShopLastSold	struct {
	Id				string
	Price			uint64
	Quantity		uint64
	User			string
}

type ShopLastOffer	struct {
	Id				string
	Offer			uint64
	User			string
}

////////////////////////////////////////////////////////////////////////////////
/// RAW
////////////////////////////////////////////////////////////////////////////////

type Raw			struct {
	Name			string
	Detail			string
}