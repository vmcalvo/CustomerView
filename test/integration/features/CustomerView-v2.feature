Feature: CustomerView (V2) Tests

    Scenario: Get me without header - Failure

        When I GET /customer360View/me
        Then response code should be 401

    Scenario: Get bad url - Not Found

        When I GET abcede
        Then response code should be 404