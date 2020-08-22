from friendlyApi import pornhub
import sys

search_keywords = []
client = pornhub.PornHub(search_keywords)


def main():
    starArr = []

    for star in client.getStars(10):
        starArr.append(star)

    print(starArr)



main()
# sys.stdout.flush()

