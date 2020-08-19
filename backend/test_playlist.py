import pytest
from api import sort_by_popularity

def test_sort_by_popularity():
    tracks_mixed = [
		{
			"name": "Classic",
			"popularity": 80,
			"uri": "dummy_val"
		},
		{
			"name": "Money Trees",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Everybody Talks",
			"popularity": 79,
			"uri": "dummy_val"
		},
		{
			"name": "Can't Hold Us - feat. Ray Dalton",
			"popularity": 83,		
			"uri": "dummy_val"
		}
	] 

    tracks_same = [
		{
			"name": "Classic",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Money Trees",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Everybody Talks",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Can't Hold Us - feat. Ray Dalton",
			"popularity": 75,		
			"uri": "dummy_val"
		}
	]

    tracks_increasing = [
		{
			"name": "Classic",
			"popularity": 80,
			"uri": "dummy_val"
		},
		{
			"name": "Money Trees",
			"popularity": 81,
			"uri": "dummy_val"
		},
		{
			"name": "Everybody Talks",
			"popularity": 82,
			"uri": "dummy_val"
		},
		{
			"name": "Can't Hold Us - feat. Ray Dalton",
			"popularity": 83,		
			"uri": "dummy_val"
		}
	]

    tracks_decreasing = [
		{
			"name": "Classic",
			"popularity": 80,
			"uri": "dummy_val"
		},
		{
			"name": "Money Trees",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Everybody Talks",
			"popularity": 73,
			"uri": "dummy_val"
		},
		{
			"name": "Can't Hold Us - feat. Ray Dalton",
			"popularity": 66,		
			"uri": "dummy_val"
		}
	]

    tracks_mixed_tie = [
		{
			"name": "Classic",
			"popularity": 80,
			"uri": "dummy_val"
		},
		{
			"name": "Money Trees",
			"popularity": 75,
			"uri": "dummy_val"
		},
		{
			"name": "Can't Hold Us - feat. Ray Dalton",
			"popularity": 83,		
			"uri": "dummy_val"
		},
        {
			"name": "Everybody Talks",
			"popularity": 75,
			"uri": "dummy_val"
		}
	]

    number = 10
    year = 2012

    correct_mixed = ["Can't Hold Us - feat. Ray Dalton", 'Classic', 'Everybody Talks', 'Money Trees']
    correct_same = ['Classic', 'Money Trees', 'Everybody Talks', "Can't Hold Us - feat. Ray Dalton"]
    correct_increasing = ["Can't Hold Us - feat. Ray Dalton", 'Everybody Talks', 'Money Trees', 'Classic']
    correct_decreasing = ['Classic', 'Money Trees', 'Everybody Talks', "Can't Hold Us - feat. Ray Dalton"]
    correct_mixed_tie = ["Can't Hold Us - feat. Ray Dalton", 'Classic', 'Money Trees', 'Everybody Talks']

    assert sort_by_popularity(number, tracks_mixed, year) == correct_mixed
    assert sort_by_popularity(number, tracks_same, year) == correct_same
    assert sort_by_popularity(number, tracks_increasing, year) == correct_increasing
    assert sort_by_popularity(number, tracks_decreasing, year) == correct_decreasing
    assert sort_by_popularity(number, tracks_mixed_tie, year) == correct_mixed_tie

