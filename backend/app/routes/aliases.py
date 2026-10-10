from fastapi import APIRouter


router = APIRouter(
    prefix="/aliases",
    tags=["Aliases"],
)


@router.get("/")
def get_aliases():
    return [
        {
            "id": 1,
            "alias_name": "ShadowFox",
            "platform": "Dark Forum",
        },
        {
            "id": 2,
            "alias_name": "NightCipher",
            "platform": "Marketplace",
        },
        {
            "id": 3,
            "alias_name": "GhostNode",
            "platform": "Encrypted Chat",
        },
        {
            "id": 4,
            "alias_name": "ZeroTrace",
            "platform": "Dark Forum",
        },
    ]