{
  "location": {
    "pathname": "category/Tacos/Carne Asada",
    "search": "",
    "hash": "",
    "action": "PUSH",
    "key": "mi5l9e",
    "query": {},
    "basename": "http://localhost:8080/"
  },
  //表示两个参数的值
  "params": {
    "category": "Tacos",
    "item": "Carne Asada"
  },
  //表示path
  "route": {
    "path": ":item"
  },
  "router": {
    "location": {
      "pathname": "category/Tacos/Carne Asada",
      "search": "",
      "hash": "",
      "action": "PUSH",
      "key": "mi5l9e",
      "query": {},
      "basename": "http://localhost:8080/"
    },
    "params": {
      "category": "Tacos",
      "item": "Carne Asada"
    },
    "routes": [
      {
        "path": "/",
        "childRoutes": [
          {
            "path": "category/:category",
            "components": {},
            "childRoutes": [
              {
                "path": ":item"
              }
            ]
          }
        ]
      },
      {
        "path": "category/:category",
        "components": {},
        "childRoutes": [
          {
            "path": ":item"
          }
        ]
      },
      {
        "path": ":item"
      }
    ]
  },
  "routeParams": {
    "item": "Carne Asada"
  },
  "routes": [
    {
      "path": "/",
      "childRoutes": [
        {
          "path": "category/:category",
          "components": {},
          "childRoutes": [
            {
              "path": ":item"
            }
          ]
        }
      ]
    },
    {
      "path": "category/:category",
      "components": {},
      "childRoutes": [
        {
          "path": ":item"
        }
      ]
    },
    {
      "path": ":item"
    }
  ],
  "children": null
}
