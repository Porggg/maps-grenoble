import requests

def giveJsonFile(name):
    url = "https://data.mobilites-m.fr/api/ficheHoraires/json?route=SEM%3A"+name
    response = requests.get(url)
    print(response.json())
    return response

name = "A"
giveJsonFile(name)