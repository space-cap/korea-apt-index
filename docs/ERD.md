erDiagram
    TB_REGION ||--o{ TB_APT_PRICE_INDEX : "contains"

    TB_REGION {
        NUMBER REGION_ID PK "Identity"
        VARCHAR2 REGION_NAME UK "Unique Name"
        NUMBER PARENT_REGION_ID "Self Reference"
        VARCHAR2 REGION_TYPE "Type"
        CHAR USE_YN "Y/N"
    }

    TB_APT_PRICE_INDEX {
        NUMBER INDEX_ID PK "Identity"
        NUMBER REGION_ID FK "Region Link"
        VARCHAR2 BASE_YYYYMM "Date"
        NUMBER INDEX_VALUE "Price Index"
    }