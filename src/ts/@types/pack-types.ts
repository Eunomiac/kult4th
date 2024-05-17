// import {K4Attribute} from "./documents/K4Actor";
import {K4Attribute, AttackRange} from "../scripts/constants";
declare global {
  namespace PackSchema {
    interface advantage {
      "ammo": PosInteger,
      attribute: K4Attribute,
      harm: PosInteger,
      isCustom: boolean,
      key: string,
        "range": [
            "object"
        ],
        "results": {
            "completeSuccess": {
                "edges": [
                    "small-posInt"
                ],
                "listRefs": [
                    "object"
                ],
                "result": [
                    "phrase-string"
                ]
            },
            "failure": {
                "edges": [
                    "small-posInt"
                ],
                "hold": [
                    "small-posInt"
                ],
                "listRefs": [
                    "object"
                ],
                "result": [
                    "phrase-string"
                ]
            },
            "partialSuccess": {
                "edges": [
                    "small-posInt"
                ],
                "listRefs": [
                    "object"
                ],
                "result": [
                    "phrase-string"
                ]
            }
        },
        "rules": {
            "holdText": [
                "phrase-string"
            ],
            "listRefs": [
                "object"
            ],
            "outro": [
                "phrase-string",
                "word-string"
            ],
            "trigger": [
                "phrase-string"
            ]
        },
        "sourceItem": {
            "name": [
                "word-string",
                "phrase-string"
            ],
            "type": [
                "word-string"
            ]
        },
        "subType": [
            "word-string"
        ]
    }
  }
}