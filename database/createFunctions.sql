CREATE OR REPLACE FUNCTION euclidean_distance(
    arr1 int_array_256_t,
    arr2 int_array_256_t
) RETURN NUMBER IS
    dist NUMBER := 0;
BEGIN
    IF arr1.COUNT != arr2.COUNT THEN
        RAISE_APPLICATION_ERROR(-20001, 'Arrays must have the same length');
    END IF;

    FOR i IN 1 .. arr1.COUNT LOOP
        dist := dist + POWER(arr1(i) - arr2(i), 2);
    END LOOP;
    RETURN SQRT(dist);
END;
/

CREATE OR REPLACE FUNCTION euclidean_distance_rgb_hist(
    r1 IN int_array_256_t,
    g1 IN int_array_256_t,
    b1 IN int_array_256_t,
    r2 IN int_array_256_t,
    g2 IN int_array_256_t,
    b2 IN int_array_256_t
) RETURN NUMBER IS
BEGIN
    RETURN euclidean_distance(r1, r2) +
           euclidean_distance(g1, g2) +
           euclidean_distance(b1, b2);
END;
/


