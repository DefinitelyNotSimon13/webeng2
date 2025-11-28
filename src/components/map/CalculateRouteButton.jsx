import React, { useContext, useMemo } from "react";
import LocationContext, { RoutingStatus } from "../../js/context";
import { Button, Preloader, Segmented, Popover } from "framework7-react";
import "./CalculateRouteButton.css";
import PropTypes from "prop-types";

function CalculateRouteButton({ onCalculateRoute, onClearRoute }) {
  const {
    currentLocation,
    targetLocation,
    routingStatus,
    routeWaypoints,
    setRoutingStatus,
  } = useContext(LocationContext);

  const startAvailable = !!currentLocation || routeWaypoints.length > 0;
  const isVisible = startAvailable && !!targetLocation;
  const isRouting = routingStatus === RoutingStatus.ROUTING;
  const isRouteFound = routingStatus === RoutingStatus.ROUTE_FOUND;
  const isFailed = routingStatus === RoutingStatus.ROUTING_FAILED;
  const isPlanning = routingStatus === RoutingStatus.PLANNING;

  const startPlanning = () => setRoutingStatus(RoutingStatus.PLANNING);
  const stopPlanning = () => setRoutingStatus(RoutingStatus.INACTIVE);

  const primaryIconMd = useMemo(() => {
    if (isRouting) return null;
    if (isFailed) return "material:warning";
    if (isRouteFound) return "material:refresh";
    return "material:navigation";
  }, [isRouting, isFailed, isRouteFound]);

  const primaryIconIos = useMemo(() => {
    if (isRouting) return null;
    if (isFailed) return "f7:exclamationmark_triangle_fill";
    if (isRouteFound) return "f7:arrow_clockwise";
    return "f7:location_north_fill";
  }, [isRouting, isFailed, isRouteFound]);

  const primaryButtonContent = useMemo(() => {
    if (isRouting) return <Preloader />;
    if (isFailed) return "Failed - Retry";
    if (isRouteFound) return "Recalculate";
    return "Calculate Route";
  }, [isRouting, isFailed, isRouteFound]);

  const primaryButtonClass = [
    "bottom-center-button",
    isRouting && "bottom-center-button--loading",
    isFailed && "bottom-center-button--failed",
  ]
    .filter(Boolean)
    .join(" ");

  const segmentedClass = [
    "bottom-button-container",
    !isVisible && "hidden",
    isRouting && "loading",
  ]
    .filter(Boolean)
    .join(" ");

  const planningButtonIconMd = isPlanning
    ? "material:close"
    : "material:keyboard_arrow_down";

  const planningButtonHandler = isPlanning ? stopPlanning : undefined;

  return (
    <>
      <Segmented round className={segmentedClass}>
        <Button
          raised
          round
          tonal
          large
          iconMd={primaryIconMd}
          iconIos={primaryIconIos}
          className={primaryButtonClass}
          onClick={onCalculateRoute}
          disabled={isRouting}
        >
          {primaryButtonContent}
        </Button>

        <Button
          raised
          round
          tonal
          large
          iconMd={planningButtonIconMd}
          iconIos="f7:location_north_fill"
          className="add-waypoint-button"
          onClick={planningButtonHandler}
          {...(!isPlanning && { popoverOpen: ".nav-action-menu" })}
        />
      </Segmented>

      <Popover className="nav-action-menu" backdrop="false">
        <Button round tonal popoverClose onClick={startPlanning}>
          Add Waypoints
        </Button>
        <Button round tonal popoverClose onClick={onClearRoute}>
          Clear Route
        </Button>
      </Popover>
    </>
  );
}

CalculateRouteButton.propTypes = {
  onCalculateRoute: PropTypes.func.isRequired,
  onClearRoute: PropTypes.func.isRequired,
};

export default CalculateRouteButton;
